import axios from 'axios'
import crypto from 'crypto'
import moment from 'moment'
import ServiceBase from '../../serviceBase'
import { isKycRequiredUser, scSum, trackEvent, trackSokulEvent } from '../../../utils/common'
import config from '../../../configs/app.config'
import { plus, round, times } from 'number-precision'
import { ERROR_MSG } from '../../../utils/constants/errors'
import { generateAccessTokenPaysafe } from './paysafe.helper'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_TYPE, EMAIL_TEMPLATES, PAYSAFE_PAYMENT_HANDLE_EVENTS, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import { sendMail } from '../../../libs/sendgrid'
import socketServer from '../../../libs/socketServer'

export default class PaySafeDepositCallbackService extends ServiceBase {
  async signatureVerification () {
    const {
      payload: { paymentType }
    } = this.args
    const { signature } = this.context.req.headers
    const { hmac_secret_apm: apmSecret, hmac_secret_card: cardSecret } =
      config.getProperties().paysafe

    let sign = ''
    const secret = paymentType === 'CARD' ? Buffer.from(cardSecret, 'base64').toString() : Buffer.from(apmSecret, 'base64').toString()
    sign = crypto.createHmac('sha256', secret).update(JSON.stringify(this.args), 'utf8').digest('base64')

    if (sign !== signature) return false
    return true
  }

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

    if (!this.signatureVerification()) { return { success: false, message: 'Signature not verified' } }

    const { eventName, payload: { merchantRefNum, transactionType, paymentHandleToken, customerIp: ipAddress } } = this.args

    const transactionDetails = await TransactionBankingModel.findOne({
      where: { transactionId: merchantRefNum },
      lock: { level: transaction.LOCK.UPDATE, of: TransactionBankingModel },
      transaction
    })

    if (!transactionDetails) { return { success: false, message: 'Transaction Not Found!' } }

    if (+transactionDetails.status === TRANSACTION_STATUS.SUCCESS) { return { success: false, message: 'Transaction Already Processed' } }

    if (+transactionDetails.status === TRANSACTION_STATUS.FAILED) { return { success: false, message: 'Transaction Already Failed' } }

    let moreDetailsData
    if (transactionDetails?.moreDetails) moreDetailsData = JSON.parse(transactionDetails.moreDetails)
    if (PAYSAFE_PAYMENT_HANDLE_EVENTS.includes(eventName)) {
      transactionDetails.status = TRANSACTION_STATUS.FAILED
      transactionDetails.moreDetails = JSON.stringify({ args: this.args, ...moreDetailsData })
      await Promise.allSettled([
        transactionDetails.save({ transaction }),
        this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
      ])
      //   await transactionDetails.save({ transaction })
      return {
        success: true,
        message: SUCCESS_MSG.TRANSACTION_SUCCESS
      }
    }
    console.log('eventNameeventName', eventName, transactionDetails?.status)
    const userDetails = await UserModel.findOne({
      attributes: ['userId', 'affiliateCode', 'email', 'firstName', 'lastName', 'kycStatus'],
      where: {
        userId: transactionDetails.actioneeId
      }
    })

    if ((eventName === 'PAYMENT_HANDLE_PAYABLE' && transactionType === 'PAYMENT')) { // Only in this condition we need to credit the accounts
      const { base_url: baseUrl } = config.getProperties().paysafe

      const options = {
        url: `${baseUrl}/v1/payments`,
        method: 'POST',
        headers: {
          Simulator: 'EXTERNAL',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: generateAccessTokenPaysafe()
        },
        data: {
          merchantRefNum,
          amount: +times(+transactionDetails.amount, 100).toFixed(0),
          currencyCode: 'USD',
          dupCheck: true,
          settleWithAuth: true,
          paymentHandleToken,
          customerIp: ipAddress
        }
      }
      let _isFirstDeposit = false
      try {
        const { data } = await axios(options)

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

        transactionDetails.moreDetails = JSON.stringify({ data, ...moreDetailsData })
        switch (data.status) {
          case 'COMPLETED': {
            const userWallet = await WalletModel.findOne({
              attributes: ['walletId', 'currencyCode', 'ownerId', 'totalScCoin', 'scCoin', 'gcCoin'],
              where: { ownerId: +transactionDetails.actioneeId },
              lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
              transaction
            })

            transactionDetails.status = TRANSACTION_STATUS.SUCCESS
            transactionDetails.isSuccess = true
            transactionDetails.isFirstDeposit = _isFirstDeposit

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
            WalletEmitter.emitUserWalletBalance({ scCoin: +scSum(userWallet), gcCoin: +round(+plus(+userWallet.gcCoin), 2) }, +transactionDetails.actioneeId)
            await Promise.allSettled([ // Error handling is being done inside the services
              (moreDetailsData?.promocode?.promocodeId ? Promise.all([UserActivitiesModel.create({ activityType: USER_ACTIVITIES_TYPE.PROMOCODE_APPLIED, userId: +transactionDetails.actioneeId, promocodeId: moreDetailsData?.promocode?.promocodeId }, { transaction }), moreDetailsData?.promocode?.maxUsersAvailed !== null ? PromocodeModel.update({ maxUsersAvailed: +moreDetailsData?.promocode.maxUsersAvailed - 1 }, { where: { promocodeId: moreDetailsData?.promocode.promocodeId }, transaction }) : Promise.resolve(null)]) : Promise.resolve(null)),
              this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
            ])
            if (userDetails && userDetails?.affiliateCode !== null) {
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
            await sendMail({
              email: userDetails.email,
              userId: transactionDetails.actioneeId,
              emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
              dynamicData: {
                name: userDetails.firstName && userDetails.lastName ? userDetails.firstName + ' ' + userDetails.lastName : userDetails.firstName || 'User',
                amount: transactionDetails?.amount
              }
            })
            break
          }
          case 'CANCELLED':
            transactionDetails.status = TRANSACTION_STATUS.CANCELLED
            await transactionDetails.save({ transaction })
            await this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
            break
          case 'FAILED':
            transactionDetails.status = TRANSACTION_STATUS.FAILED
            await transactionDetails.save({ transaction })
            await this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
            break
        }

        return {
          success: 'true',
          message: SUCCESS_MSG.TRANSACTION_SUCCESS
        }
      } catch (error) {
        console.log('Error in Paysafe Deposit callback', JSON.stringify(error?.response?.data?.error))
        await this.removeActivePromocodeCount(moreDetailsData?.promocode?.promocodeId, transactionDetails.actioneeId)
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
          if (userDetails && userDetails?.affiliateCode !== null) {
            const affiliate = userDetails.affiliateCode.replaceAll('-', '')
            const scalioData = {
              timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
              type: _isFirstDeposit ? 'ftd' : 'dep',
              click_id: affiliate,
              adv_user_id: userWallet?.ownerId,
              amount: transactionDetails?.amount,
              currency: 'USD',
              event_id: transactionDetails?.transactionBankingId
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
          await sendMail({
            email: userDetails.email,
            userId: transactionDetails.actioneeId,
            emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
            dynamicData: {
              name: userDetails.firstName && userDetails.lastName ? userDetails.firstName + ' ' + userDetails.lastName : userDetails.firstName || 'User',
              amount: transactionDetails?.amount
            }
          })
        }

        return {
          success: false,
          message: ERROR_MSG.TRANSACTION_FAILED
        }
      }
    } else if (eventName === 'PAYMENT_COMPLETED' && transactionDetails.status !== TRANSACTION_STATUS.SUCCESS && transactionDetails.status !== TRANSACTION_STATUS.FAILED) {
      let _isFirstDeposit = false
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
      if (userDetails && userDetails?.affiliateCode !== null) {
        const affiliate = userDetails.affiliateCode.replaceAll('-', '')
        const scalioData = {
          timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          type: _isFirstDeposit ? 'ftd' : 'dep',
          click_id: affiliate,
          adv_user_id: userWallet?.ownerId,
          amount: transactionDetails?.amount,
          currency: 'USD',
          event_id: transactionDetails?.transactionBankingId
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
      await sendMail({
        email: userDetails.email,
        userId: transactionDetails.actioneeId,
        emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
        dynamicData: {
          name: userDetails.firstName && userDetails.lastName ? userDetails.firstName + ' ' + userDetails.lastName : userDetails.firstName || 'User',
          amount: transactionDetails?.amount
        }
      })

      await Promise.all([userWallet.save({ transaction }), transactionDetails.save({ transaction })])

      WalletEmitter.emitUserWalletBalance({ scCoin: +scSum(userWallet), gcCoin: +round(+plus(+userWallet.gcCoin), 2), status: 'SUCCESS' }, +transactionDetails.actioneeId)
      WalletEmitter.emitPaymentStatus({ status: 'SUCCESS' }, +transactionDetails.actioneeId)
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
