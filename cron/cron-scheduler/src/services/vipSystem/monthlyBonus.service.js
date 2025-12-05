import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { CreateTransactionService } from '../common/createTransaction.service'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { Logger } from '@src/libs/logger'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'

export class MonthlyBonusService extends ServiceBase {
  async run () {

    const transaction = this?.args?.seqTransaction || await sequelize.transaction()
    try {
      const monthlyBonusEntry = await sequelize.models.bonus.findOne({
        attributes: ['id'],
        where: {
          bonusType: BONUS_TYPES.CASH_BACK,
          isActive: true
        }
      })
      if (!monthlyBonusEntry) {
        return { success: false, message: 'Monthly Bonus is inactive', data: null }
      }
      const totalBetWinAmountQuery = `SELECT
           u.id,
           COALESCE(SUM(CASE WHEN l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END), 0) AS "totalBetAmount",
           COALESCE(SUM(CASE WHEN l.purpose = 'CasinoWin' THEN l.amount ELSE 0 END), 0) AS "totalWinAmount"
           FROM
               users u
           JOIN
               casino_transactions ct ON u.id = ct.user_id
           JOIN
               ledgers l ON ct.id = l.transaction_id
           JOIN
               currencies c ON c.id = l.currency_id
           WHERE c.code IN ('PSC', 'BSC', 'RSC')
           AND ct.created_at >= NOW() - INTERVAL '30 days'
           GROUP BY u.id;`

      const totalBetWinAmount = await sequelize.query(totalBetWinAmountQuery, { type: sequelize.QueryTypes.SELECT })

      const totalCashbackAmountFromStartofTheMonthQuery = `SELECT
      u.id,
      COALESCE(SUM(CASE WHEN l.purpose IN ('VipTierMonthlyBonus') THEN l.amount ELSE 0 END), 0) AS "totalCashbackAmount"
      FROM
          users u
      JOIN
          casino_transactions ct ON u.id = ct.user_id
      JOIN
          ledgers l ON ct.id = l.transaction_id
      JOIN
          currencies c ON c.id = l.currency_id
      WHERE c.code in ('BSC')
      AND ct.created_at >= DATE_TRUNC('month', NOW())
      GROUP BY u.id;`

      const totalCashbackAmountFromStartofTheMonth = await sequelize.query(totalCashbackAmountFromStartofTheMonthQuery, { type: sequelize.QueryTypes.SELECT })

      let bonusAmount

      if (totalBetWinAmount.length > 0) {
        for (let i = 0; i < totalBetWinAmount.length; i++) {
          const { id, totalBetAmount: totalBetAmountValue, totalWinAmount: totalWinAmountValue } = totalBetWinAmount[i]
          const cashbackRow = totalCashbackAmountFromStartofTheMonth.find(row => row.id === id)
          const totalCashbackAmountGiven = cashbackRow?.totalCashbackAmount || 0
          const userVipTier = await sequelize.models.userVipTier.findOne({
            where: { userId: id, isActive: true },
            attributes: ['vipLevelId'],
            include: [
              {
                model: sequelize.models.vipTier,
                attributes: ['id', 'monthlyPercentage', 'cashbackMonthlyLimit']
              }
            ]
          })

          if (userVipTier && userVipTier.vipTier) {
            const { monthlyPercentage, cashbackMonthlyLimit } = userVipTier.vipTier

            console.log('monthlyPercentage', monthlyPercentage)
            console.log('userVipTier.vipTier', userVipTier.vipTier)
            if (totalBetAmountValue <= 0 || NumberPrecision.minus(cashbackMonthlyLimit, totalCashbackAmountGiven) === 0) {
              bonusAmount = 0
            }
            else {
              const currentBonusAmount = NumberPrecision.times(totalBetAmountValue, monthlyPercentage / 100)
              bonusAmount = Math.min(NumberPrecision.minus(cashbackMonthlyLimit, totalCashbackAmountGiven), currentBonusAmount)
            }
          }

          const walletDetails = await sequelize.models.wallet.findOne({
            where: { userId: id },
            attributes: ['id'],
            include: [
              {
                model: sequelize.models.currency,
                where: { code: 'BSC' },
                attributes: ['id', 'code']
              }
            ],
            transaction
          })

          const transactionDetails = await CreateTransactionService.execute({
            userId: id,
            paymentId: uuid(),
            amount: bonusAmount || 0,
            wallet: walletDetails,
            purpose: LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS,
            seqTransaction: transaction
          })
          if (_.size(transactionDetails.errors)) return this.mergeErrors(transactionDetails.errors)

          const monthlyBonusEntry = await sequelize.models.bonus.findOne({
            attributes: ['id'],
            where: {
              bonusType: BONUS_TYPES.CASH_BACK,
              isActive: true
            }
          })

          await sequelize.models.userBonus.create({
            bonusId: monthlyBonusEntry.id,
            userId: id,
            transactionId: transactionDetails.id,
            status: USER_BONUS_STATUS_VALUES.CLAIMED,
            claimedAt: new Date()
          }, { transaction })


        }
      }
      if (!this?.args?.seqTransaction) await transaction.commit()

      return { success: true, message: 'Monthly Bonus Service executed successfully', data: null }
    } catch (error) {
      Logger.error('Monthly Bonus Service Error', { message: 'Monthly Bonus Service Error', exception: error })
      if (!this?.args?.seqTransaction) await transaction.rollback()
      return { success: false, message: 'Error in Monthly Bonus Service', data: null, error }
    }
  }
}
