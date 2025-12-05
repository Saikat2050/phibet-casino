import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { CreateTransactionService } from '../common/createTransaction.service'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { Logger } from '@src/libs/logger'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'

export class RakebackBonusService extends ServiceBase {
  async run () {
    const transaction = this?.args?.seqTransaction || await sequelize.transaction()
    try {
      const rackbackBonusEntry = await sequelize.models.bonus.findOne({
        attributes: ['id'],
        where: {
          bonusType: BONUS_TYPES.RAKE_BACK,
          isActive: true
        }
      })
      if (!rackbackBonusEntry) {
        return { success: false, message: 'Rackback Bonus is inactive', data: null }
      }

      const totalLossAmountQuery = `
        SELECT
          ct.user_id AS "userId",
          ROUND(
            (COALESCE(SUM(CASE WHEN l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN l.purpose = 'CasinoWin' THEN l.amount ELSE 0 END), 0))::numeric,
            2
          ) AS "rakebackData"
        FROM
            public.casino_transactions ct
        JOIN
            public.ledgers l ON ct.id = l.transaction_id
        JOIN
            public.currencies c ON c.id = l.currency_id
        WHERE
            c.code IN ('PSC', 'BSC', 'RSC')
            AND l.purpose IN ('CasinoBet', 'CasinoWin')
            AND ct.created_at >= CURRENT_DATE - INTERVAL '30 days'
            AND ct.created_at < CURRENT_DATE
        GROUP BY
            ct.user_id
        HAVING
            COALESCE(SUM(CASE WHEN l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN l.purpose = 'CasinoWin' THEN l.amount ELSE 0 END), 0) > 0
        ORDER BY
            ct.user_id ASC;
      `

      const totalLossAmount = await sequelize.query(totalLossAmountQuery, { type: sequelize.QueryTypes.SELECT })

      if (totalLossAmount.length > 0) {
        await Promise.allSettled(
          totalLossAmount.map(async ({ userId, rakebackData }) => {
            try {
              let bonusAmount = 0
              const userVipTier = await sequelize.models.userVipTier.findOne({
                where: { userId, isActive: true },
                attributes: ['vipLevelId'],
                include: [
                  {
                    model: sequelize.models.vipTier,
                    attributes: ['id', 'rakebackPercentage', 'rakebackMonthlyLimit']
                  }
                ]
              })

              if (userVipTier && userVipTier.vipTier) {
                const { rakebackPercentage, rakebackMonthlyLimit } = userVipTier.vipTier
                bonusAmount = Math.max(
                  0,
                  Math.min(rakebackMonthlyLimit, rakebackData * rakebackPercentage)
                )
              }
              if (!bonusAmount || bonusAmount <= 0) {
                Logger.info(`Skipping Rakeback bonus for user ${userId} as amount = 0`)
                return { skipped: true }
              }

              const walletDetails = await sequelize.models.wallet.findOne({
                where: { userId },
                attributes: ['id'],
                include: [
                  {
                    model: sequelize.models.currency,
                    where: { code: 'BSC' },
                    attributes: ['id', 'code']
                  }
                ]
              })

              if (!walletDetails) {
                Logger.warn(`No BSC wallet found for user ${userId}, skipping Rakeback bonus`)
                return
              }

              const transactionDetails = await CreateTransactionService.execute({
                userId,
                paymentId: uuid(),
                amount: bonusAmount,
                wallet: walletDetails,
                purpose: LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS,
                seqTransaction: transaction
              })
              if (_.size(transactionDetails.errors)) {
                Logger.error(`Transaction failed for user ${userId}`, transactionDetails.errors)
                return
              }

              await sequelize.models.bonus.increment(
                { claimedCount: 1 },
                {
                  where: {
                    bonusType: BONUS_TYPES.RAKE_BACK,
                    isActive: true
                  },
                  transaction
                }
              )

              await sequelize.models.userBonus.create({
                bonusId: rackbackBonusEntry.id,
                userId,
                transactionId: transactionDetails.id,
                status: USER_BONUS_STATUS_VALUES.CLAIMED,
                claimedAt: new Date()
              }, { transaction })

              const userInfo = await sequelize.models.user.findOne({
                where: { id: userId },
                attributes: ['id', 'email']
              })


            } catch (err) {
              Logger.error(`Error processing Rakeback bonus for user ${userId}`, { exception: err })
            }
          })
        )
      }

      if (!this?.args?.seqTransaction) await transaction.commit()
      return { success: true, message: 'Rakeback Bonus Service executed successfully', data: null }
    } catch (error) {
      Logger.error('Rakeback Bonus Service Error', { message: 'Rakeback Bonus Service Error', exception: error })
      if (!this?.args?.seqTransaction) await transaction.rollback()
      return { success: false, message: 'Error in Rakeback Bonus Service', data: null, error }
    }
  }
}
