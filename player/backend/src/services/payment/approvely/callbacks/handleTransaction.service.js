import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { PaymentTransactionService } from '../../../transaction/paymentTransaction.service'
import { LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { TRANSACTION_STATUS, APPROVELY_TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'
import { AvailDepositReferralAmountService } from '@src/services/user/availDepositReferralAmount.service'
import Sequelize from 'sequelize'
import { dayjs } from '@src/libs/dayjs'
import { ScaleoAxios } from '@src/libs/axios/scaleo.axios'
import { AvailDepositBonusService } from '@src/services/user/availDepositBonuses.sservice'
// import { ApprovelyOverrideChargebackService } from '@src/services/user/approvelyOverrideChargeback.service'

export class HandleApprovelyTxnService extends ServiceBase {
  async cleanupPromocodeRedisKey (promocode, userId) {
    if (!promocode?.promocode || !userId) return

    const promocodeRecord = await this.context.sequelize.models.promocode.findOne({
      where: { promocode: promocode.promocode.trim() },
      attributes: ['id'],
      raw: true
    })

    if (promocodeRecord) {
      await removeData(`promocodeCount:${promocodeRecord.id}:${userId}`)
    }
  }
  async run () {
    try {
      const { eventType, data } = this.args
      const transaction = this.context.sequelizeTransaction
      const { userActivity: userActivityModel, promocode: PromocodeModel, package: PackageModel } = this.context.sequelize.models

      const transactionDetails = await this.context.sequelize.models.transaction.findOne({
        attributes: ['status', 'userId', 'moreDetails', 'paymentProviderId', 'paymentId', 'amount'],
        where: { paymentId: data?.webhookInfo?.transactionId },
        lock: { level: transaction.LOCK.UPDATE, of: this.context.sequelize.models.transaction },
        transaction
      })

      if (!transactionDetails) { return { success: false, message: 'Transaction Not Found!' } }
      if (transactionDetails?.status === TRANSACTION_STATUS.COMPLETED) { return { success: false, message: 'Transaction Already Processed' } }

      if (eventType === APPROVELY_TRANSACTION_STATUS.SETTLED) { // Only in this condition we need to credit the accounts
        const hasMadeFirstPurchase = await this.context.sequelize.models.ledger.findOne({
          attributes: ['id'],
          include: [
            {
              model: this.context.sequelize.models.transaction,
              as: 'transactionLedger',
              where: { userId: transactionDetails?.userId },
              attributes: []
            }
          ],
          where: {
            purpose: {
              [Sequelize.Op.in]: [
                LEDGER_PURPOSE.PURCHASE_GC_COIN,
                LEDGER_PURPOSE.PURCHASE_SC_COIN,
                LEDGER_PURPOSE.PURCHASE_GC_BONUS,
                LEDGER_PURPOSE.PURCHASE_SC_BONUS
              ]
            }
          },
          transaction,
          raw: true
        })
        const isFirstPurchase = hasMadeFirstPurchase === null

        // for over riding chargeback protection
        // const hasMadeFirstApprovelyPurchase = await this.context.sequelize.models.ledger.count({
        //   col: 'id',
        //   include: [
        //     {
        //       model: this.context.sequelize.models.transaction,
        //       as: 'transactionLedger',
        //       where: {
        //         userId: transactionDetails?.userId,
        //         paymentProviderId: {
        //           [Sequelize.Op.eq]: Sequelize.literal(`(
        //           SELECT id FROM "payment_providers"
        //           WHERE LOWER("aggregator") = 'approvely'
        //           AND LOWER("name"->>'EN') = 'coinflow'
        //           )`)
        //         }
        //       },
        //       attributes: [],
        //       required: true
        //     }
        //   ],
        //   where: {
        //     purpose: {
        //       [Sequelize.Op.in]: [
        //         LEDGER_PURPOSE.PURCHASE_GC_COIN,
        //         LEDGER_PURPOSE.PURCHASE_SC_COIN,
        //         LEDGER_PURPOSE.PURCHASE_GC_BONUS,
        //         LEDGER_PURPOSE.PURCHASE_SC_BONUS
        //       ]
        //     }
        //   },
        //   transaction,
        //   raw: true
        // })

        const user = await this.context.sequelize.models.user.findOne({
          where: { id: transactionDetails?.userId },
          include: {
            model: this.context.sequelize.models.wallet,
            attributes: ['id'],
            include: { model: this.context.sequelize.models.currency, where: { code: [SWEEPS_COINS.GC, SWEEPS_COINS.PSC, SWEEPS_COINS.BSC] }, attributes: ['code'], required: true }
          },
          attributes: ['email', 'id', 'affiliateCode', 'referredBy', 'uniqueId']
        })

        if (user && user.affiliateCode !== null) {
          await ScaleoAxios.sendEventData({
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            type: isFirstPurchase ? 'ftd' : 'dep',
            click_id: user.affiliateCode.replaceAll('-', ''),
            adv_user_id: user.id,
            amount: (transactionDetails?.amount).toFixed(2),
            currency: 'USD',
            event_id: transactionDetails.paymentId
          })
        }

        for (const wallet of user.wallets) {
          const transactionData = [
            {
              amount: wallet.currency.code === SWEEPS_COINS.GC
                ? transactionDetails.moreDetails.gcCoin
                : wallet.currency.code === SWEEPS_COINS.PSC
                  ? transactionDetails.moreDetails.scCoin
                  : 0,
              purpose: wallet.currency.code === SWEEPS_COINS.GC
                ? LEDGER_PURPOSE.PURCHASE_GC_COIN
                : wallet.currency.code === SWEEPS_COINS.PSC
                  ? LEDGER_PURPOSE.PURCHASE_SC_COIN
                  : null
            },
            {
              amount: wallet.currency.code === SWEEPS_COINS.GC
                ? transactionDetails.moreDetails.gcBonus
                : wallet.currency.code === SWEEPS_COINS.BSC
                  ? transactionDetails.moreDetails.scBonus
                  : 0,
              purpose: wallet.currency.code === SWEEPS_COINS.GC
                ? LEDGER_PURPOSE.PURCHASE_GC_BONUS
                : wallet.currency.code === SWEEPS_COINS.BSC
                  ? LEDGER_PURPOSE.PURCHASE_SC_BONUS
                  : null
            }
          ]

          for (const { amount, purpose } of transactionData) {
            if (amount > 0) {
              await PaymentTransactionService.execute({
                amount,
                transactionId: transactionDetails?.paymentId,
                moreDetails: { ...data?.webhookInfo },
                userId: user?.id,
                walletId: wallet?.id,
                purpose,
                status: TRANSACTION_STATUS.COMPLETED,
                paymentProviderId: transactionDetails?.paymentProviderId
              }, this.context)
            }
          }
        }
        if (isFirstPurchase && user.referredBy) {
          await AvailDepositReferralAmountService.execute({ id: user.referredBy, referredTo: user?.id }, this.context)
        }
        try {
          await AvailDepositBonusService.execute({
            userId: transactionDetails.userId,
            transactionId: transactionDetails.moreDetails.transactionId
          }, this.context)
        } catch (bonusErr) {
          console.error('Failed to apply deposit bonus:', bonusErr)
        }
        // if (!hasMadeFirstApprovelyPurchase) ApprovelyOverrideChargebackService.execute({ id: user.uniqueId }, this.context)

        // Handle promocode related updates
        if (transactionDetails?.moreDetails?.promocode) {
          const promocode = await PromocodeModel.findOne({
            where: { promocode: transactionDetails.moreDetails.promocode.promocode.trim() },
            transaction
          })

          if (promocode) {
            // promocode event
            // Create user activity entry
            await userActivityModel.create({
              userId: transactionDetails.userId,
              activityType: 'PROMO_CODE_APPLIED',
              promocodeId: promocode.id
            }, { transaction })

            // Update promocode max users availed count
            if (promocode.maxUsersAvailed !== null) {
              await PromocodeModel.update(
                { maxUsersAvailed: Sequelize.literal('max_users_availed - 1') },
                {
                  where: { id: promocode.id },
                  transaction
                }
              )
            }
          }
        }

        // Clean up promocode Redis key after successful payment
        await this.cleanupPromocodeRedisKey(transactionDetails?.moreDetails?.promocode, transactionDetails?.userId)

      }

      if (eventType === APPROVELY_TRANSACTION_STATUS.DECLINED) {
        await PaymentTransactionService.execute({
          transactionId: transactionDetails?.paymentId,
          moreDetails: { ...data?.webhookInfo },
          userId: transactionDetails?.userId,
          purpose: LEDGER_PURPOSE.PURCHASE,
          status: TRANSACTION_STATUS.FAILED,
          paymentProviderId: transactionDetails?.paymentProviderId
        }, this.context)
        // Clean up promocode Redis key after timeout
        await this.cleanupPromocodeRedisKey(transactionDetails?.moreDetails?.promocode, transactionDetails?.userId)

      }

      return { success: true, result: { success: true } }
    } catch (error) {
      if (transactionDetails) {
        await this.cleanupPromocodeRedisKey(transactionDetails?.moreDetails?.promocode, transactionDetails?.userId)
      }
      this.context.logger.error(error)
      throw new APIError(error)
    }
  }
}
