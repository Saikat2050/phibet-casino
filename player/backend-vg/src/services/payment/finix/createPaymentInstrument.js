
import { createPaymentInstrument, makePaymentFinix, refund } from '../../../helpers/finix'
import { EMAIL_TEMPLATES, FINIX_MESSAGES, FINIX_STATUS, PAYMENT_METHOD, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../../utils/constants/constant'
import ServiceBase from '../../serviceBase'
// import { sequelize } from '../../../db/models'
import { plus, minus } from 'number-precision'
// import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import config from '../../../configs/app.config'
import { v4 as uuid } from 'uuid'
import { round } from 'lodash'
import moment from 'moment'
import { isKycRequiredUser, scSum, trackEvent, trackSokulEvent } from '../../../utils/common'
import { sendMail } from '../../../libs/sendgrid'
import socketServer from '../../../libs/socketServer'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
/**
 * @Service Create Payment Instrument
 * Used to create -
 * 1. Payment instrument
 * 2. Do the payment
 * 3. Detect Fradulent Behaviour
 * @args {token, type, identity, fraud_session_id, amount, packageId}
 * @returns {status, message}
 */

export default class CreatePaymentInstrument extends ServiceBase {
  async run () {
    const {
      token,
      type,
      identity,
      amount,
      packageDetail,
      promocodeDetail,
      address,
      name,
      fraudSessionId,
      thirdPartyToken
    } = this.args
    const transactionId = uuid()
    let paymentTransactionId
    const { detail } = this.context.req.user
    // const sequelizeTransaction = await sequelize.transaction()
    const extraHeaders = {
      'User-Id': detail.userId
    }

    const {
      dbModels: {
        TransactionBanking: TransactionBankingModel,
        Wallet: WalletModel,
        Promocode: PromocodeModel,
        UserActivities: UserActivitiesModel,
        GlobalSetting: GlobalSettingModel,
        User: UserModel
        // Package: PackageModel
      },
      sequelizeTransaction
    } = this.context

    const responseObj = {}

    try {
    //   const packageDetail = await getOne({
    //     model: PackageModel,
    //     data: { packageId },
    //     attributes: [
    //       'amount',
    //       'packageId',
    //       'gcCoin',
    //       'scCoin',
    //       'welcomePurchaseBonusApplicable'
    //     ]
    //   })

      //   if (!packageDetail) return this.addError('NotFound')

      let createInstrumentPayload
      if (type === 'GOOGLE_PAY' || type === 'APPLE_PAY') {
        createInstrumentPayload = {
          identity,
          merchant_identity: config.get('finix.merchantId'),
          name,
          third_party_token: thirdPartyToken,
          type,
          address
        }
      } else {
        createInstrumentPayload = {
          token,
          type,
          identity
        }
      }
      const data = await createPaymentInstrument(createInstrumentPayload, extraHeaders)

      console.log(data, '====================payment instrument===================\n\n\n')
      if (!data) {
        await sequelizeTransaction.rollback()
        return this.addError('FinixPaymentInstrumentCreationError')
      }

      const paymet = await makePaymentFinix({
        merchant: config.get('finix.merchantId'),
        currency: detail.currencyCode,
        amount: +packageDetail?.amount * 100,
        source: data.id,
        idempotency_id: new Date().valueOf().toString(),
        fraud_session_id: fraudSessionId
      }, extraHeaders)
      console.log(paymet, '======================finix payment===============\n\n\n')

      if (!paymet) {
        await sequelizeTransaction.rollback()
        return this.addError('FinixPaymentFailureError')
      }
      paymentTransactionId = paymet.id
      const userWallet = await WalletModel.findOne({
        where: { ownerId: detail?.userId },
        lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
        transaction: sequelizeTransaction
      })

      userWallet.gcCoin = +plus(
        packageDetail?.gcCoin,
        userWallet.gcCoin
      ).toFixed(2)

      userWallet.scCoin = {
        ...userWallet.scCoin,
        psc: +plus(
          packageDetail?.scCoin,
          userWallet.scCoin.psc
        ).toFixed(2)
      }

      const beforeBalance = {
        gcCoin: +minus(
          userWallet.gcCoin,
          packageDetail?.gcCoin
        ).toFixed(2),
        scCoin: {
          ...userWallet.scCoin,
          psc: +minus(
            userWallet.scCoin.psc,
            packageDetail.scCoin
          ).toFixed(2)
        }
      }
      const moreDetails = {
        bonusSc: +round(+packageDetail.bonusSc, 2),
        bonusGc: +round(+packageDetail.bonusGc, 2),
        promocode: promocodeDetail
      }
      const moreDetailsString = JSON.stringify(moreDetails)
      let _isFirstDeposit = false

      const isFirstDeposit = await TransactionBankingModel.findOne({
        where: {
          actioneeId: +detail?.userId,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          isSuccess: true
        },
        raw: true,
        transaction: sequelizeTransaction
      })
      if (!isFirstDeposit) _isFirstDeposit = true
      const transactionObj = {
        actioneeType: ROLE.USER,
        actioneeId: detail.userId,
        actioneeName: `${detail.firstName} ${
            detail.middleName ? `${detail.middleName} ` : ''
          } ${detail.lastName}`,
        actioneeEmail: detail.email,
        walletId: detail.userWallet.walletId,
        currencyCode: 'USD',
        amount: +round(+packageDetail?.amount, 2),
        status: TRANSACTION_STATUS.PENDING,
        countryCode: 'US',
        transactionId,
        transactionType: TRANSACTION_TYPE.DEPOSIT,
        isFirstDeposit: _isFirstDeposit,
        isSuccess: false,
        paymentMethod: PAYMENT_METHOD.FINIX,
        packageId: packageDetail.packageId,
        paymentTransactionId,
        gcCoin: packageDetail.gcCoin,
        scCoin: packageDetail.scCoin,
        afterBalance: {
          gcCoin: userWallet.gcCoin,
          scCoin: userWallet.scCoin
        },
        beforeBalance: beforeBalance,
        moreDetails: moreDetailsString
      }

      if (paymet.state === FINIX_STATUS.SUCCEEDED) {
        await userWallet.save({ transaction: sequelizeTransaction })

        transactionObj.status = TRANSACTION_STATUS.SUCCESS
        transactionObj.isSuccess = true
        transactionObj.moreDetails = JSON.stringify({ paymet, ...moreDetails })
        if (moreDetails?.promocode?.promocodeId) transactionObj.promocodeId = +moreDetails?.promocode.promocodeId
        const transactionDetails = await TransactionBankingModel.create(transactionObj, { transaction: sequelizeTransaction })
        if (detail.kycStatus !== 'K4' && detail.kycStatus !== 'K5') {
          const resultData = await isKycRequiredUser(
            TransactionBankingModel,
            GlobalSettingModel,
            transactionDetails.actioneeId,
            sequelizeTransaction
          )

          await UserModel.update(
            { isKycRequired: resultData },
            {
              where: { userId: detail.userId },
              transaction: sequelizeTransaction
            }
          )
        }
        if (detail && detail.affiliateCode !== null) {
          const affiliate = detail.affiliateCode.replaceAll('-', '')
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
          email: detail.email,
          type: _isFirstDeposit ? 'ftd' : 'dep',
          amount: transactionDetails?.amount
        }
        if (moreDetails?.promocode?.promocodeId) {
          sokulData = { ...sokulData, bonus_id: +moreDetails?.promocode?.promocodeId }
        }
        await trackSokulEvent(sokulData, 'baseEvents')
        sendMail({
          email: detail?.email,
          userId: transactionDetails.actioneeId,
          emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
          dynamicData: {
            name: detail.firstName && detail.lastName ? detail.firstName + ' ' + detail.lastName : detail.firstName || 'User',
            amount: transactionDetails?.amount
          }
        })
        // await sequelizeTransaction.commit()

        WalletEmitter.emitPaymentStatus({ status: 'SUCCESS', transactionId: transactionId }, +transactionDetails.actioneeId)
        WalletEmitter.emitUserWalletBalance({ scCoin: +scSum(userWallet), gcCoin: +round(+plus(+userWallet.gcCoin), 2) }, +transactionDetails.actioneeId)
        await Promise.allSettled([ // Error handling is being done inside the services
          (moreDetails?.promocode?.promocodeId ? Promise.all([UserActivitiesModel.create({ activityType: USER_ACTIVITIES_TYPE.PROMOCODE_APPLIED, userId: +transactionDetails.actioneeId, promocodeId: moreDetails?.promocode?.promocodeId }, { transaction: sequelizeTransaction }), moreDetails?.promocode?.maxUsersAvailed !== null ? PromocodeModel.update({ maxUsersAvailed: +moreDetails?.promocode.maxUsersAvailed - 1 }, { where: { promocodeId: moreDetails?.promocode.promocodeId }, transaction: sequelizeTransaction }) : Promise.resolve(null)]) : Promise.resolve(null)),
          this.removeActivePromocodeCount(moreDetails?.promocode?.promocodeId, transactionDetails.actioneeId)
        ])
        await sequelizeTransaction.commit()
      } else if (paymet.state === FINIX_STATUS.PENDING) {
        await userWallet.save({ transaction: sequelizeTransaction })
        const transactionDetails = await TransactionBankingModel.create(transactionObj, { transaction: sequelizeTransaction })
        if (detail && detail.affiliateCode !== null) {
          const affiliate = detail.affiliateCode.replaceAll('-', '')
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
          email: detail.email,
          type: _isFirstDeposit ? 'ftd' : 'dep',
          amount: transactionDetails?.amount
        }
        if (moreDetails?.promocode?.promocodeId) {
          sokulData = { ...sokulData, bonus_id: +moreDetails?.promocode?.promocodeId }
        }
        await trackSokulEvent(sokulData, 'baseEvents')
        sendMail({
          email: detail?.email,
          userId: transactionDetails.actioneeId,
          emailTemplate: EMAIL_TEMPLATES.DEPOSIT,
          dynamicData: {
            name: detail.firstName && detail.lastName ? detail.firstName + ' ' + detail.lastName : detail.firstName || 'User',
            amount: transactionDetails?.amount
          }
        })

        WalletEmitter.emitPaymentStatus({ status: 'PENDING', transactionId: transactionId }, +transactionDetails.actioneeId)
        WalletEmitter.emitUserWalletBalance({ scCoin: +scSum(userWallet), gcCoin: +round(+plus(+userWallet.gcCoin), 2) }, +transactionDetails.actioneeId)
        await Promise.allSettled([ // Error handling is being done inside the services
          (moreDetails?.promocode?.promocodeId ? Promise.all([UserActivitiesModel.create({ activityType: USER_ACTIVITIES_TYPE.PROMOCODE_APPLIED, userId: +transactionDetails.actioneeId, promocodeId: moreDetails?.promocode?.promocodeId }, { transaction: sequelizeTransaction }), moreDetails?.promocode?.maxUsersAvailed !== null ? PromocodeModel.update({ maxUsersAvailed: +moreDetails?.promocode.maxUsersAvailed - 1 }, { where: { promocodeId: moreDetails?.promocode.promocodeId }, transaction: sequelizeTransaction }) : Promise.resolve(null)]) : Promise.resolve(null)),
          this.removeActivePromocodeCount(moreDetails?.promocode?.promocodeId, transactionDetails.actioneeId)
        ])
        await sequelizeTransaction.commit()
      } else if (
        paymet.state === FINIX_STATUS.CANCELED ||
paymet.state === FINIX_STATUS.FAILED ||
paymet.state === FINIX_STATUS.UNKNOWN
      ) {
        transactionObj.status = TRANSACTION_STATUS.FAILED
        transactionObj.isSuccess = false
        transactionObj.moreDetails = JSON.stringify({ paymet, ...moreDetails })
        if (moreDetails?.promocode?.promocodeId) transactionObj.promocodeId = +moreDetails?.promocode.promocodeId
        await TransactionBankingModel.create(transactionObj, { transaction: sequelizeTransaction })
        await sequelizeTransaction.commit()
        await Promise.allSettled([
          this.removeActivePromocodeCount(moreDetails?.promocode?.promocodeId, detail.userId)
        ])
      }

      responseObj.status = paymet.state
      responseObj.message = FINIX_MESSAGES[paymet.state]
      responseObj.transactionId = transactionId

      return {
        ...responseObj,
        transactionId,
        success: true
      }
    } catch (e) {
      await this.removeActivePromocodeCount(promocodeDetail?.promocodeId, detail?.userId)
      await sequelizeTransaction.rollback()
      if (paymentTransactionId) {
        refund({
          refund_amount: amount,
          tags: {
            test: 'refund'
          }
        }, paymentTransactionId, extraHeaders)
      }
    }
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
