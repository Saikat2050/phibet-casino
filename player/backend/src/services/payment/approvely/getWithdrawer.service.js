
import { APIError } from '@src/errors/api.error'
import { ApprovelyAxios } from '@src/libs/axios/approvely.axios'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'
import { appConfig } from '@src/configs'
import { Logger } from '@src/libs/logger'

const moment = require('moment-timezone')

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    ssn: { type: 'string' }
  },
  required: ['userId']
})

export class ApprovelyGetWithdrawerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, ssn } = this.args
    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: this.args.userId },
        attributes: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phoneVerified', 'email', 'uniqueId', 'approvelyWithdrawerId', 'kycStatus'],
        include: {
          model: this.context.sequelize.models.address,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      })

      const providerDetails = await this.context.sequelize.models.paymentProvider.findOne({
        where: {
          withdrawAllowed: true,
          aggregator: { [Op.iLike]: 'approvely' },
          name: { EN: { [Op.iLike]: 'coinflow' } }
        },
        attributes: ['withdrawKycRequired', 'withdrawProfileRequired', 'withdrawPhoneRequired'],
        raw: true
      })
      if (!providerDetails) return this.addError('PaymentProviderNotExistErrorType')

      if (providerDetails?.withdrawProfileRequired && (!user.firstName || !user.lastName || !user.dateOfBirth || !user.gender || !user.addresses?.[0]?.zipCode || !user.addresses?.[0]?.city || !user.addresses?.[0]?.stateCode || !(user.addresses?.[0]?.address1 || !user.addresses?.[0]?.address2))) return this.addError('ProfileRequiredErrorType')
      if (providerDetails?.withdrawPhoneRequired && !user.phoneVerified) return this.addError('PhoneRequiredErrorType')
      if (providerDetails?.withdrawKycRequired && user.kycStatus !== KYC_STATUS.COMPLETED) return this.addError('KycRequiredErrorType')

      if (user?.approvelyWithdrawerId) {
        const getWithdrawerResponse = await ApprovelyAxios.getWithdrawer(user?.uniqueId)
        Logger.info(`Checking for verification Link - ${JSON.stringify(getWithdrawerResponse)}`)
        if (getWithdrawerResponse?.verificationLink) {
          return getWithdrawerResponse
        }
        return { bankAccounts: getWithdrawerResponse?.withdrawer?.bankAccounts ?? [], cards: getWithdrawerResponse?.withdrawer?.cards ?? [] }
      }

      if (!ssn) return this.addError('SsnRequiredErrorType')
      const userAddress = await this.context.sequelize.models.address.findOne({ attributes: ['address1', 'address2', 'city', 'stateCode', 'zipCode', 'countryCode'], where: { userId }, raw: true })
      const body = {
        info: {
          email: user?.email,
          firstName: user?.firstName,
          surName: user?.lastName,
          physicalAddress: [userAddress?.address1, userAddress?.address2].filter(Boolean).join(' ').trim(),
          city: userAddress?.city,
          state: userAddress?.stateCode,
          zip: userAddress?.zipCode,
          country: userAddress?.countryCode,
          dob: moment.utc(user?.dateOfBirth).format('YYYYMMDD'),
          ssn
        },
        redirectLink: `${appConfig.app.userFeUrl}?modal=redeem`
      }
      const approvelyUserRegisterResponse = await ApprovelyAxios.registerUser(user?.uniqueId, body)
      const approvelyWithdrawerId = approvelyUserRegisterResponse?.withdrawer?._id
      if (approvelyWithdrawerId) {
        await this.context.sequelize.models.user.update(
          { approvelyWithdrawerId },
          { where: { id: userId } }
        )
      }
      return approvelyUserRegisterResponse?.verificationLink ? approvelyUserRegisterResponse : []
    } catch (error) {
      throw new APIError(error)
    }
  }
}
