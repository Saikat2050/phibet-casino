import moment from 'moment'
import ServiceBase from '../../serviceBase'
import { isKycRequiredUser, scSum, trackEvent, trackSokulEvent } from '../../../utils/common'
import { plus, round } from 'number-precision'
import { ERROR_MSG } from '../../../utils/constants/errors'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, APPROVELY_TRANSACTION_STATUS, BONUS_TYPE, EMAIL_TEMPLATES, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import { Op } from 'sequelize'
import { sendMail } from '../../../libs/sendgrid'
import Logger from '../../../libs/logger'
import socketServer from '../../../libs/socketServer'

export default class ApprovelyDepositCallbackService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        TransactionBanking: TransactionBankingModel,
        Wallet: WalletModel,
        User: UserModel,
        Promocode: PromocodeModel,
        UserActivities: UserActivitiesModel,
        GlobalSetting: GlobalSettingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { eventType, data } = this.args

    const transactionDetails = await TransactionBankingModel.findOne({
      where: { transactionId: data?.webhookInfo?.transactionId },
      lock: { level: transaction.LOCK.UPDATE, of: TransactionBankingModel },
      transaction
    })

    if (!transactionDetails) { return { success: false, message: 'Transaction Not Found!' } }

    if (+transactionDetails?.status === TRANSACTION_STATUS.SUCCESS) { return { success: true, message: 'Transaction Already Processed' } }

    // if (+transactionDetails?.status === TRANSACTION_STATUS.FAILED) { return { success: false, message: 'Transaction Already Failed' } }

    let moreDetailsData
    if (transactionDetails?.moreDetails) moreDetailsData = JSON.parse(transactionDetails.moreDetails)
    if (eventType === APPROVELY_TRANSACTION_STATUS.DECLINED) {
      transactionDetails.status = TRANSACTION_STATUS.FAILED
      transactionDetails.paymentTransactionId = data?.id
      transactionDetails.moreDetails = JSON.stringify({ args: this.args, ...moreDetailsData })
      await Promise.allSettled([
        transactionDetails.save({ transaction }),
        this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
      ])
      //  await transactionDetails.save({ transaction })
      WalletEmitter.emitPaymentStatus({ status: 'FAILED', transactionId: data?.webhookInfo?.transactionId }, +transactionDetails.actioneeId)
      return {
        success: true,
        message: SUCCESS_MSG.TRANSACTION_SUCCESS
      }
    } else if (eventType === APPROVELY_TRANSACTION_STATUS.SETTLED) {
      // Only in this condition we need to credit the accounts
      let _isFirstDeposit = false
      try {
        const isFirstDeposit = await TransactionBankingModel.findOne({
          where: {
            actioneeId: +transactionDetails.actioneeId,
            transactionType: TRANSACTION_TYPE.DEPOSIT,
            isSuccess: true
          },
          raw: true,
          transaction
        })
        if (!isFirstDeposit) _isFirstDeposit = true
        const userWallet = await WalletModel.findOne({
          attributes: ['walletId', 'currencyCode', 'ownerId', 'totalScCoin', 'scCoin', 'gcCoin'],
          where: { ownerId: +transactionDetails.actioneeId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })

        transactionDetails.status = TRANSACTION_STATUS.SUCCESS
        transactionDetails.isSuccess = true
        transactionDetails.isFirstDeposit = _isFirstDeposit
        transactionDetails.paymentTransactionId = data?.id
        transactionDetails.moreDetails = JSON.stringify({ data, ...moreDetailsData })
        transactionDetails.beforeBalance = {
          scCoin: +round(+userWallet.totalScCoin, 2),
          gcCoin: +round(+userWallet.gcCoin, 2)
        }

        userWallet.gcCoin = round(+plus(+userWallet.gcCoin, +transactionDetails.gcCoin), 2)
        userWallet.scCoin = { ...userWallet.scCoin, psc: +round(+plus(+userWallet.scCoin.psc, +transactionDetails.scCoin), 2) }

        transactionDetails.afterBalance = {
          scCoin: +scSum(userWallet),
          gcCoin: +round(+userWallet.gcCoin, 2)
        }
        const userDetails = await UserModel.findOne({
          attributes: ['userId', 'affiliateCode', 'email', 'firstName', 'lastName', 'kycStatus'],
          where: {
            userId: transactionDetails.actioneeId
          }
        })
        if (userDetails && userDetails.affiliateCode !== null) {
          const affiliate = userDetails.affiliateCode.replaceAll('-', '')
          const scalioData = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: _isFirstDeposit ? 'ftd' : 'dep',
            click_id: affiliate,
            adv_user_id: userWallet?.ownerId,
            amount: transactionDetails?.amount,
            currency: 'USD',
            event_id: transactionDetails?.casinoTransactionId
          }
          await trackEvent(scalioData)
        }
        let sokulData = {
          email: userDetails.email,
          type: _isFirstDeposit ? 'ftd' : 'dep',
          amount: transactionDetails?.amount
        }
        if (moreDetailsData?.promocode?.promocodeId) {
          sokulData = { ...sokulData, bonus_id: +moreDetailsData?.promocode?.promocodeId }
        }
        await trackSokulEvent(sokulData, 'baseEvents')
        sendMail({
          email: userDetails?.email,
          userId: transactionDetails.actioneeId,
          emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
          dynamicData: {
            name: userDetails.firstName && userDetails.lastName ? userDetails.firstName + ' ' + userDetails.lastName : userDetails.firstName || 'User',
            amount: transactionDetails?.amount
          }
        })
        if (moreDetailsData?.promocode?.promocodeId) transactionDetails.promocodeId = +moreDetailsData?.promocode.promocodeId
        await Promise.all([userWallet.save({ transaction }), transactionDetails.save({ transaction })])
        if (userDetails.kycStatus !== 'K4' && userDetails.kycStatus !== 'K5') {
          const resultData = await isKycRequiredUser(
            TransactionBankingModel,
            GlobalSettingModel,
            transactionDetails.actioneeId,
            transaction
          )
          userDetails.isKycRequired = resultData
          await userDetails.save({ transaction })
        }
        WalletEmitter.emitPaymentStatus({ status: 'SUCCESS', transactionId: data?.webhookInfo?.transactionId }, +transactionDetails.actioneeId)
        WalletEmitter.emitUserWalletBalance({ scCoin: +scSum(userWallet), gcCoin: +round(+plus(+userWallet.gcCoin), 2) }, +transactionDetails.actioneeId)
        await Promise.allSettled([ // Error handling is being done inside the services
          (moreDetailsData?.promocode?.promocodeId ? Promise.all([UserActivitiesModel.create({ activityType: USER_ACTIVITIES_TYPE.PROMOCODE_APPLIED, userId: +transactionDetails.actioneeId, promocodeId: moreDetailsData?.promocode?.promocodeId }, { transaction }), moreDetailsData?.promocode?.maxUsersAvailed !== null ? PromocodeModel.update({ maxUsersAvailed: +moreDetailsData?.promocode.maxUsersAvailed - 1 }, { where: { promocodeId: moreDetailsData?.promocode.promocodeId }, transaction }) : Promise.resolve(null)]) : Promise.resolve(null)),
          this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
        ])
        return {
          msg: 'success',
          status: 'success'
        }
      } catch (error) {
        await this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
        Logger.error('Error in access token creation', error)
        if (+transactionDetails.status === TRANSACTION_STATUS.PENDING) {
          transactionDetails.status = TRANSACTION_STATUS.FAILED
        }
        transactionDetails.moreDetails = JSON.stringify({ error: error?.response?.data, ...moreDetailsData })
        await transactionDetails.save({ transaction })

        if (transactionDetails.status === TRANSACTION_STATUS.SUCCESS) {
          const userWallet = await WalletModel.findOne({
            attributes: ['walletId', 'currencyCode', 'ownerId', 'totalScCoin', 'scCoin', 'gcCoin'],
            where: { ownerId: +transactionDetails.actioneeId },
            lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
            transaction
          })
          const userDetails = await UserModel.findOne({
            attributes: ['userId', 'affiliateCode', 'email', 'firstName', 'lastName'],
            where: {
              userId: transactionDetails.actioneeId,
              affiliateCode: {
                [Op.not]: null
              }
            }
          })
          if (userDetails) {
            const affiliate = userDetails.affiliateCode.replaceAll('-', '')
            const scalioData = {
              timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
              type: _isFirstDeposit ? 'ftd' : 'dep',
              click_id: affiliate,
              adv_user_id: userWallet?.ownerId,
              amount: transactionDetails?.amount,
              currency: 'USD',
              event_id: transactionDetails?.casinoTransactionId
            }
            await trackEvent(scalioData)
            let sokulData = {
              email: userDetails.email,
              type: _isFirstDeposit ? 'ftd' : 'dep',
              amount: transactionDetails?.amount
            }
            if (moreDetailsData?.promocode?.promocodeId) {
              sokulData = { ...sokulData, bonus_id: +moreDetailsData?.promocode?.promocodeId }
            }
            await trackSokulEvent(sokulData, 'baseEvents')
            sendMail({
              email: userDetails.email,
              userId: transactionDetails.actioneeId,
              emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
              dynamicData: {
                name: userDetails.firstName && userDetails.lastName ? userDetails.firstName + ' ' + userDetails.lastName : userDetails.firstName || 'User',
                amount: transactionDetails?.amount
              }
            })
          }
          WalletEmitter.emitPaymentStatus({ status: 'SUCCESS', transactionId: data?.webhookInfo?.transactionId }, +transactionDetails.actioneeId)
        }

        return {
          success: false,
          message: ERROR_MSG.TRANSACTION_FAILED
        }
      }
    }
    return {
      success: false,
      message: 'Please use correct eventName'
    }
  }

  async awardPackageBonus (transactionId, userWallet, moreDetailsData, CasinoTransactionModel, transaction) {
    console.log('=====================AwardPackageBonus : Started===================')
    if (+moreDetailsData?.bonusSc || +moreDetailsData?.bonusGc) {
      const beforeScBalance = +scSum(userWallet)
      const beforeGcBalance = +round(+userWallet.gcCoin, 2)

      userWallet.gcCoin = +round(+plus(+userWallet.gcCoin, +moreDetailsData?.bonusGc), 2)

      userWallet.scCoin = {
        ...userWallet.scCoin,
        bsc: +round(+plus(+userWallet.scCoin.bsc, +moreDetailsData?.bonusSc), 2)
      }

      const moreDetails = {
        transactionId,
        beforeGcBalance,
        beforeScBalance,
        afterScCBalance: +scSum(userWallet),
        afterGcCBalance: +round(+userWallet.gcCoin, 2)
      }

      await CasinoTransactionModel.create(
        {
          userId: +userWallet.ownerId,
          actionType: BONUS_TYPE.PACKAGE_BONUS,
          actionId: ACTION_TYPE.CREDIT,
          status: TRANSACTION_STATUS.SUCCESS,
          walletId: +userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          sc: +moreDetailsData?.bonusSc || 0,
          gc: +moreDetailsData?.bonusGc || 0,
          amountType: AMOUNT_TYPE.SC_GC_COIN,
          moreDetails,
          roundId: 'NULL',
          transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`
        },
        { transaction }
      )
    }
    console.log('=====================AwardPackageBonus : Finished===================')
  }

  async removeActivePromocodeCount (promocodeId, userId) {
    try {
      const activeCount = await socketServer.redisClient.get(`promocodeCount:${promocodeId}:${userId}`)
      if (activeCount && +activeCount > 0) await socketServer.redisClient.decr(`promocodeCount:${promocodeId}:${userId}`)
    } catch (error) {
      console.log(error)
    }
  }
}
