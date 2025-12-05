import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { PAYMENT_AGGREGATOR, TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'
import { PaysafeDepositAmountService } from '../payment/paysafe/depositAmount.service'
import { CreateApprovelyPurchaseTxnService } from '../payment/approvely/purchaseTransaction.service'
import { KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amount: { type: 'number' },
    packageId: { type: 'string' },
    ipAddress: { type: 'string' },
    paymentProviderId: { type: 'number' },
    promocode: { type: 'string' },

  },
  required: ['userId', 'packageId', 'amount']
})

export class PurchasePackageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { userId, amount, packageId, paymentProviderId, ipAddress ,promocode} = this.args
      let result
      let newAmount = amount

      const user = await this.context.sequelize.models.user.findOne({ where: { id: userId }, raw: true })

      const providerDetails = await this.context.sequelize.models.paymentProvider.findOne({
        where: { id: paymentProviderId, depositAllowed: true },
        attributes: ['depositKycRequired', 'depositProfileRequired', 'depositPhoneRequired', 'aggregator']
      })
      if (!providerDetails) return this.addError('PaymentProviderNotExistErrorType')

      if (providerDetails.depositKycRequired && user.kycStatus !== KYC_STATUS.COMPLETED) return this.addError('KycRequiredErrorType') // Need to check it later
      if (providerDetails.depositPhoneRequired && !user.phoneVerified) return this.addError('PhoneRequiredErrorType')
      if (providerDetails.depositProfileRequired && (!user.firstName || !user.lastName || !user.dateOfBirth)) return this.addError('ProfileRequiredErrorType')

      const sweepPackage = await this.context.sequelize.models.package.findOne({
        attributes: ['gcCoin', 'scCoin', 'maxPurchasePerUser', 'id', 'scBonus', 'gcBonus', 'discountAmount', 'discountEndDate'],
        where: { id: packageId, isActive: true, isVisibleInStore: true },
        raw: true
      })
      if (!sweepPackage) return this.addError('PackageNotFoundErrorType')
// TODO-LimitCheck? and error handling of promocode flag true
      let promocodeDetail
      if (promocode) {
        try {
          const { packageData: updatedPackageDetail, completePackageDetail } = await ApplyPromocodeService.run({ packageId, promocode, flag: true, userId }, this.context)

          sweepPackage = { ...sweepPackage, amount: updatedPackageDetail.amount, gcCoin: updatedPackageDetail.gcCoin, scCoin: updatedPackageDetail.scCoin }
          promocodeDetail = completePackageDetail
        } catch (error) {
          console.log('------------------------ Wrong Promocode -----------------------', error)
        }
      }
      const cooldownSetting = await this.context.sequelize.models.setting.findOne({
        where: { key: SETTING_KEYS.PURCHASE_COOLDOWN },
        raw: true
      })
      if (cooldownSetting && cooldownSetting.value) {
        const cooldownMinutes = parseInt(cooldownSetting.value, 10)
        if (!isNaN(cooldownMinutes) && cooldownMinutes > 0) {
          const lastPurchase = await this.context.sequelize.models.transaction.findOne({
            where: {
              userId: user.id,
              packageId,
              status: TRANSACTION_STATUS.COMPLETED
            },
            order: [['createdAt', 'DESC']],
            raw: true
          })
          if (lastPurchase && lastPurchase.createdAt) {
            const lastPurchaseTime = new Date(lastPurchase.createdAt)
            const now = new Date()
            const diffMs = now - lastPurchaseTime
            const diffMinutes = diffMs / (1000 * 60)
            if (diffMinutes < cooldownMinutes) {
              const remainingMinutes = Math.ceil(cooldownMinutes - diffMinutes)
              return this.addError('PurchaseCooldownErrorType', `Purchase cooldown period has not passed yet. Please wait ${remainingMinutes} minute(s) before making another purchase.`)
            }
          }
        }
      }
      newAmount = sweepPackage.amount

      const userPurchases = await this.context.sequelize.models.transaction.count({
        col: 'id',
        where: { userId: user.id, packageId, status: TRANSACTION_STATUS.COMPLETED }
      })
      if (sweepPackage.maxPurchasePerUser && userPurchases >= sweepPackage.maxPurchasePerUser) return this.addError('MaxPurchaseLimitReachedErrorType')

      if (sweepPackage.discountEndDate && ((new Date(sweepPackage.discountEndDate)) > (new Date()))) {
        newAmount = +sweepPackage.discountAmount
      }

      if (providerDetails.aggregator.toUpperCase() === PAYMENT_AGGREGATOR.PAYSAFE) result = await PaysafeDepositAmountService.execute({ user, amount: newAmount, ipAddress, packageDetail: sweepPackage, paymentProviderId,promocodeDetail }, this.context)
      else if (providerDetails.aggregator.toUpperCase() === PAYMENT_AGGREGATOR.APPROVELY) result = await CreateApprovelyPurchaseTxnService.execute({ user, amount: newAmount, ipAddress, packageDetail: sweepPackage, paymentProviderId ,promocodeDetail}, this.context)

      return { success: true, ...result?.result }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
