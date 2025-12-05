import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ShuftiAxios } from '@src/libs/axios/shufti.axios'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class InitKycService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: this.args.userId },
        attributes: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phoneVerified', 'email', 'uniqueId'],
        include: {
          model: this.context.sequelize.models.address,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      })

      if (!user.firstName || !user.lastName || !user.dateOfBirth || !user.gender || !user.addresses?.[0]?.zipCode || !user.addresses?.[0]?.city || !user.addresses?.[0]?.stateCode || !(user.addresses?.[0]?.address1 || !user.addresses?.[0]?.address2)) return this.addError('ProfileRequiredErrorType')
      if (!user.phoneVerified) return this.addError('PhoneRequiredErrorType')

      const payload = {
        reference: `${user.uniqueId}_${Math.random()}`,
        callback_url: `${appConfig.app.userBeUrl}/callback/v1/shufti/status`,
        email: user.email,
        country: 'US',
        language: 'EN',
        redirect_url: `${appConfig.app.userFeUrl}`,
        verification_mode: 'any',
        allow_offline: '1',
        allow_online: '1',
        show_privacy_policy: '1',
        show_results: '1',
        show_consent: '1',
        show_feedback_form: '0',
        allow_na_ocr_inputs: '1'
      }
      payload.face = ''
      payload.document = {
        proof: '',
        name: '',
        dob: '',
        issue_date: '',
        supported_types: ['id_card', 'driving_license', 'passport']
      }

      // Commenting address verification and consent verification for testing approved KYC, also it will not work in Production (Depends on production plan purchased)
      // payload.address = {
      //   proof: '',
      //   name: '',
      //   full_address: `${user.addresses?.[0].address1 || user.addresses?.[0].address2}, ${user.addresses?.[0].city}, ${user.addresses?.[0].stateCode}, United States - ${user.addresses?.[0].zipCode}`,
      //   address_fuzzy_match: '1',
      //   issue_date: '',
      //   supported_types: ['utility_bill', 'passport', 'bank_statement']
      // }
      // payload.consent = {
      //   proof: '',
      //   supported_types: ['printed'],
      //   text: 'Show your uploaded document for verification to confirm your identity and consent.'
      // }

      const kycData = await ShuftiAxios.initializeVerification(payload)

      return { ...kycData }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
