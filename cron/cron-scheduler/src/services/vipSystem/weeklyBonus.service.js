import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { CreateTransactionService } from '../common/createTransaction.service'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

export class WeeklyBonusService extends ServiceBase {
  async run () {
    const transaction = this?.args?.seqTransaction || await sequelize.transaction()
    try {
      const totalBetAmountQuery = `SELECT
        u.id,
        COALESCE(SUM(CASE WHEN l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END), 0) AS "totalBetAmount"
        FROM
            users u
        JOIN
            casino_transactions ct ON u.id = ct.user_id
        JOIN
            ledgers l ON ct.id = l.transaction_id
        JOIN
            currencies c ON c.id = l.currency_id
        WHERE c.code in ('BSC','PSC','RSC')
        AND ct.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY u.id;`

      const totalBetAmount = await sequelize.query(totalBetAmountQuery, { type: sequelize.QueryTypes.SELECT })
      let bonusAmount

      if (totalBetAmount.length > 0) {
        for (let i = 0; i < totalBetAmount.length; i++) {
          const { id, totalBetAmount: totalBetAmountValue } = totalBetAmount[i]
          const userVipTier = await sequelize.models.userVipTier.findOne({
            where: { userId: id, isActive: true },
            attributes: ['vipLevelId'],
            include: [
              {
                model: sequelize.models.vipTier,
                attributes: ['id', 'weeklyPercentage']
              }
            ]
          })

          if (userVipTier && userVipTier.vipTier) {
            const { weeklyPercentage } = userVipTier.vipTier
            bonusAmount = (totalBetAmountValue * weeklyPercentage) / 100
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
            purpose: LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS,
            seqTransaction: transaction
          })
          if (_.size(transactionDetails.errors)) return this.mergeErrors(transactionDetails.errors)
        }
      }

      if (!this?.args?.seqTransaction) await transaction.commit()

      return { success: true, message: 'Weekly Bonus Service executed successfully', data: null }
    } catch (error) {
      await transaction.rollback()
      return { success: false, message: 'Error in Weekly Bonus Service', data: null, error }
    }
  }
}
