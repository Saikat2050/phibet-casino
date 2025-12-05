import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { PaysafeAxios } from '@src/libs/axios/paysafe.axios'
import { PaymentTransactionService } from '../../transaction/paymentTransaction.service'
import { LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { PAYSAFE_PAYMENT_EVENT, PAYSAFE_PAYMENT_HANDLE_EVENTS, TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'
import { AvailDepositReferralAmountService } from '@src/services/user/availDepositReferralAmount.service'
import Sequelize from 'sequelize'
import { dayjs } from '@src/libs/dayjs'
import { trackScaleoEvent } from '@src/helpers/common.helper'
import { AvailDepositBonusService } from '@src/services/user/availDepositBonuses.sservice'

export class PaysafeDepositWebhookService extends ServiceBase {
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
      const { eventName, payload: { merchantRefNum, transactionType, paymentHandleToken, customerIp: ipAddress, id, ...payloadDetails } } = this.args
      const transaction = this.context.sequelizeTransaction
      const { userActivity: userActivityModel, promocode: PromocodeModel , } = this.context.sequelize.models

      let transactionStatus

      const transactionDetails = await this.context.sequelize.models.transaction.findOne({
        where: { paymentId: id, moreDetails: { transactionId: merchantRefNum } },
        lock: { level: transaction.LOCK.UPDATE, of: this.context.sequelize.models.transaction },
        transaction
      })

      if (!transactionDetails) { return { success: false, message: 'Transaction Not Found!' } }
      if (transactionDetails.status === TRANSACTION_STATUS.COMPLETED) { return { success: false, message: 'Transaction Already Processed' } }
      if (transactionDetails.status === TRANSACTION_STATUS.FAILED) { return { success: false, message: 'Transaction Already Failed' } }

      if (PAYSAFE_PAYMENT_HANDLE_EVENTS.includes(eventName)) transactionStatus = TRANSACTION_STATUS.FAILED
      else if (PAYSAFE_PAYMENT_EVENT.includes(eventName)) transactionStatus = TRANSACTION_STATUS.COMPLETED

      if (transactionStatus === TRANSACTION_STATUS.COMPLETED) {
        const paysafeUserToken = await PaysafeAxios.createPayment({
          body: {
            merchantRefNum,
            amount: +NumberPrecision.times(+transactionDetails.amount, 100).toFixed(0),
            currencyCode: 'USD',
            dupCheck: true,
            settleWithAuth: true,
            paymentHandleToken,
            customerIp: ipAddress
          }
        })
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
        if (paysafeUserToken?.status === TRANSACTION_STATUS.COMPLETED) {
          const user = await this.context.sequelize.models.user.findOne({
            where: { id: transactionDetails.userId },
            include: {
              model: this.context.sequelize.models.wallet,
              attributes: ['id'],
              include: { model: this.context.sequelize.models.currency, where: { code: [SWEEPS_COINS.GC, SWEEPS_COINS.PSC, SWEEPS_COINS.BSC] }, attributes: ['code'], required: true }
            },
            attributes: ['email', 'id', 'referredBy', 'affiliateCode']
          })

          if (user && user.affiliateCode !== null) {
            const scaleoData = {
              timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              type: 'dep',
              click_id: user.affiliateCode.replaceAll('-', ''),
              adv_user_id: user.id,
              amount: transactionDetails?.amount,
              currency: 'USD',
              event_id: transactionDetails.moreDetails.transactionId
            }
            await trackScaleoEvent(scaleoData)
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
                  transactionId: transactionDetails.moreDetails.transactionId,
                  moreDetails: { ...payloadDetails },
                  userId: user.id,
                  walletId: wallet.id,
                  purpose,
                  status: transactionStatus,
                  paymentId: transactionDetails?.paymentId,
                  paymentProviderId: transactionDetails?.paymentProviderId
                }, this.context)
              }
            }
          }
          if (isFirstPurchase && user.referredBy) {
            await AvailDepositReferralAmountService.execute({ id: user.referredBy }, this.context)
          }

         try {
            await AvailDepositBonusService.execute({
              userId: transactionDetails.userId,
              transactionId: transactionDetails.moreDetails.transactionId
            }, this.context)
          } catch (bonusErr) {
            console.error('Failed to apply deposit bonus:', bonusErr)
          }
        } else transactionStatus = TRANSACTION_STATUS.FAILED
 // Handle promocode related updates

        if (transactionDetails?.moreDetails?.promocode) {
          const promocode = await PromocodeModel.findOne({
            where: { promocode: transactionDetails.moreDetails.promocode.promocode.trim() },
            transaction
          })

          if (promocode) {
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

      if (transactionStatus === TRANSACTION_STATUS.FAILED) {
        await PaymentTransactionService.execute({
          transactionId: transactionDetails.moreDetails.transactionId,
          moreDetails: { ...payloadDetails },
          userId: transactionDetails.userId,
          purpose: LEDGER_PURPOSE.PURCHASE,
          status: transactionStatus,
          paymentId: transactionDetails?.paymentId,
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
      throw new APIError(error)
    }
  }
}
