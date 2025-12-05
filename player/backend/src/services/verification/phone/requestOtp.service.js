
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { sendSms } from '@src/libs/s3'
import ServiceBase from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    phone: { type: 'string' },
    code: { type: 'number' },
    userId: { type: 'string' }
  },
  required: ['phone', 'code']
})

export class RequestMobileOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { phone, code, userId } = this.args
    const userModel = this.context.sequelize.models.user
    const transaction = this.context.sequelizeTransaction

    try {
      const userDetails = await userModel.findOne({ where: { id: userId }, attributes: ['id', 'phoneVerified', 'phone', 'phoneOtp', 'phoneCode'], transaction })

      if (!userDetails) return this.addError('UserDoesNotExistsErrorType')
      if (userDetails.phoneVerified) return this.addError('PhoneAlreadyVerifiedErrorType')

      if (!userDetails.phone || (userDetails.phone && userDetails.phone !== phone)) {
        const phoneExists = await this.context.sequelize.models.user.findOne({ where: { phone }, attributes: ['id'] })
        if (phoneExists) return this.addError('PhoneIsTakenErrorType')
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const result = await sendSms({ phone: `+${code}${phone}`, otp })

      if (result?.$metadata?.httpStatusCode === 200) await userDetails.set({ phone, phoneOtp: otp, phoneCode: `+${code}`, newOtpRequested: new Date() }).save({ transaction })
      else return this.addError('InternalServerErrorType')

      return { success: true, data: {}, message: SUCCESS_MSG.OTP_SENT }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
