import ServiceBase from '../serviceBase'
import {
  CACHE_KEYS,
  EMAIL_TEMPLATES,
  FINIX_ROLES,
  KYC_STATUS,
  PAYMENT_METHOD,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE
} from '../../utils/constants/constant'
import {
  checkDepositLimit,
  checkResponsibleGamblingLimits,
  checkResponsibleGamblingTimeBreakLimit
} from '../../utils/responsibleGambling'
import { initPaymentPaysafe, initPayoutPaysafe } from './paysafe/paysafe.helper'
import { sendMail } from '../../libs/sendgrid'
import { ApplyPromocodeService } from '../player/applyPromocode.service'

import { Op } from 'sequelize'
import { approvelyPurchaseTransaction } from './approvely/approvelyPurchaseTransaction.helper'
import { initPushcashPayment, initPayoutPushcash } from './pushcash/pushcash.helper'
import { createFinixIdentity } from '../../helpers/finix'
import socketServer from '../../libs/socketServer'

export class InitPaymentService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { Package: PackageModel, GlobalSetting: SettingsModel, TransactionBanking: TransactionBankingModel, User: UserModel, Wallet: WalletModel, PaymentProvider: PaymentProviderModel },
      sequelizeTransaction: transaction
    } = this.context

    const { paymentType, ipAddress, packageId, amount, actionableEmail, promocode, paymentProvider, bankAccountId, token } = this.args
    let paymentData, packageDetail

    try {
      // Profile Check
      if (user.kycStatus === KYC_STATUS.ACCOUNT_CREATED || user.kycStatus === KYC_STATUS.ACCOUNT_EMAIL_VERIFIED) return this.addError('IncompleteProfileError')

      // RSG Time Break Check
      const timeBreakLimitCheck = await checkResponsibleGamblingTimeBreakLimit(user.userId)
      if (timeBreakLimitCheck?.limitReached) return { success: false, timeBreakLimitCheck }

      // RSG Deposit Limit Check
      const timeLimitCheck = await checkResponsibleGamblingLimits(user.userId)
      if (timeLimitCheck?.limitReached) return { success: false, timeLimitCheck }

      // Deposit
      if (paymentType === TRANSACTION_TYPE.DEPOSIT) {
        // Desperate times calls for desperate times
        await WalletModel.findOne({
          where: { ownerId: user.userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })
        packageDetail = await PackageModel.findOne({
          attributes: ['amount', 'packageId', 'gcCoin', 'scCoin', 'purchaseLimitPerUser', 'welcomePurchaseBonusApplicable', 'welcomePurchaseBonusApplicableMinutes', 'bonusSc', 'bonusGc'],
          where: { packageId },
          raw: true,
          transaction
        })
        if (!packageDetail) return this.addError('NotFound')

        if (packageDetail.purchaseLimitPerUser > 0) {
          const packagePurchaseCount = await TransactionBankingModel.count({
            where: {
              actioneeId: user.userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              packageId: packageId
            },
            transaction
          })

          if (packagePurchaseCount && packagePurchaseCount >= packageDetail.purchaseLimitPerUser) return this.addError('PurchaseLimitReachedErrorType')

          const currentTime = new Date()
          currentTime.setMinutes(currentTime.getMinutes() - 2)

          const isPurchaseActive = await TransactionBankingModel.findOne({
            where: {
              actioneeId: user.userId,
              status: TRANSACTION_STATUS.PENDING,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              packageId: packageId,
              createdAt: {
                [Op.gte]: currentTime
              }
            },
            transaction
          })

          if (isPurchaseActive) return this.addError('PackageCoolDownPeriodErrorType')
        }

        if (packageDetail.welcomePurchaseBonusApplicable) {
          const userDetail = await UserModel.findOne({
            where: { userId: user.userId },
            attributes: ['createdAt']
          })

          const currentTime = new Date().getTime()
          const signupTime = new Date(userDetail.createdAt).getTime()
          const durationMinutes = packageDetail.welcomePurchaseBonusApplicableMinutes * 60 * 1000

          if ((currentTime - signupTime) > durationMinutes) {
            return this.addError('WelcomePurchaseBonusExpireErrorType')
          }

          const isWelcomePurchasePurchased = await TransactionBankingModel.findOne({
            where: {
              isSuccess: true,
              actioneeId: user.userId,
              packageId: +packageDetail.packageId,
              transactionType: TRANSACTION_TYPE.DEPOSIT
            },
            transaction
          })

          if (isWelcomePurchasePurchased) return this.addError('WelcomePurchasePackageIsOnlyAvailableOnceErrorType')
        }

        // Deposit Limit Check

        let promocodeDetail
        if (promocode) {
          try {
            const { packageData: updatedPackageDetail, completePackageDetail } = await ApplyPromocodeService.run({ packageId, promocode, flag: true }, this.context)
            packageDetail = { ...packageDetail, amount: updatedPackageDetail.amount, gcCoin: updatedPackageDetail.gcCoin, scCoin: updatedPackageDetail.scCoin }
            promocodeDetail = completePackageDetail
          } catch (error) {
            console.log('------------------------ Wrong Promocode -----------------------', error)
          }
        }
        const limitCheck = await checkDepositLimit({
          userId: user.userId,
          depositAmount: parseFloat(packageDetail.amount)
        })
        if (limitCheck.limitReached) return { success: false, limitCheck }
        if (paymentProvider === 'CreditCard') {
          let paymentProviders = await socketServer.redisClient.get(CACHE_KEYS.PAYMENTPROVIDER)
          if (!paymentProviders) {
            paymentProviders = await PaymentProviderModel.findAll({
              where: {
                isArchived: false
              }
            })
          }
          paymentProviders = JSON.parse(paymentProviders)
          const activeProviders = paymentProviders.filter(p => p.depositAllowed)
          const totalWeight = activeProviders.reduce((sum, p) => sum + p.weight, 0)
          const normalizedProviders = activeProviders.map(p => ({
            paymentProviderName: p.paymentProviderName,
            weight: (p.weight / totalWeight) * 100
          }))
          let cumulative = 0
          const ranges = normalizedProviders.map(p => {
            const start = cumulative
            cumulative += p.weight
            return { name: p.paymentProviderName, range: [start, cumulative] }
          })
          const rand = Math.random() * 100
          const selected = ranges.find(p => rand >= p.range[0] && rand < p.range[1])
          if (selected?.name === PAYMENT_METHOD.APPROVELY) {
            paymentData = await approvelyPurchaseTransaction({
              user,
              amount: +packageDetail.amount,
              ipAddress,
              packageDetail,
              promocodeDetail,
              transaction,
              token
            })
            paymentData = { ...paymentData, paymentProvider: PAYMENT_METHOD.APPROVELY }
          } else if ((selected?.name === PAYMENT_METHOD.FINIX)) {
            const data = await createFinixIdentity(
              {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
              },
              (FINIX_ROLES.BUYER),
              {
                'User-Id': user.userId
              }
            )

            if (!data) {
              return this.addError('FinixIdentityCreationError')
            }
            paymentData = { ...data, packageDetail, promocodeDetail, paymentProvider: PAYMENT_METHOD.FINIX }
          }
        } else if (paymentProvider === PAYMENT_METHOD.PUSHCASH) {
          paymentData = await initPushcashPayment({
            user,
            amount: +packageDetail.amount,
            ipAddress,
            packageDetail,
            promocodeDetail,
            transaction
          })
          paymentData = { ...paymentData, packageDetail, promocodeDetail }
        } else {
          paymentData = await initPaymentPaysafe({
            user,
            amount: +packageDetail.amount,
            ipAddress,
            packageDetail,
            promocodeDetail,
            transaction
          })
        }
      } else if (paymentType === TRANSACTION_TYPE.WITHDRAW) {
        // Redeem Coins
        const [minimumCoins, maximumCoins] = await SettingsModel.findAll({
          attributes: ['value'],
          where: {
            key: ['MINIMUM_REDEEMABLE_COINS', 'MAXIMUM_REDEEMABLE_COINS']
          },
          transaction
        })

        if (user.isInternalUser) return this.addError('InternalUsersCannotRedeemErrorType')

        if (amount && minimumCoins && (amount > user.userWallet.scCoin.wsc)) return this.addError('RedeemableCoinsErrorType')
        if (amount && minimumCoins && (amount < +minimumCoins.value)) return this.addError('MinimumRedeemableCoinsErrorType', '')

        if (amount && maximumCoins && +amount > +maximumCoins.value) return this.addError('MaximumRedeemableLimitReachedErrorType')

        if (!(user.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED || user.kycStatus === KYC_STATUS.ACCOUNT_FULLY_VERIFIED || user.kycStatus === KYC_STATUS.APPROVED)) return this.addError('KycRequiredErrorType')

        if (paymentProvider === PAYMENT_METHOD.PUSHCASH) {
          paymentData = await initPayoutPushcash({
            user,
            amount,
            actionableEmail,
            transaction,
            paymentProvider,
            bankAccountId
          })
        } else {
          paymentData = await initPayoutPaysafe({
            user,
            amount,
            actionableEmail,
            transaction,
            paymentProvider,
            bankAccountId
          })
        }
        // send email for withdraw user
        sendMail({
          email: user.email,
          userId: user.userId,
          emailTemplate: EMAIL_TEMPLATES.REDEEM_REQUEST,
          dynamicData: {
            email: user.email,
            user_id: user.userId,
            userName: user.username,
            name: user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.firstName || 'User',
            amount: amount
          }
        })
      }

      return { success: true, paymentData }
    } catch (error) {
      console.log('Error Occur in InitPaymentService', error)
      return this.addError('UnableToInitializePaymentErrorType', error)
    }
  }
}
