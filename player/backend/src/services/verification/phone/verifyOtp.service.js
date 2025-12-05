import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/public.constants.utils'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    phone: { type: 'string' },
    code: { type: 'number' },
    userId: { type: 'string' },
    otp: { type: 'string' }
  },
  required: ['phone', 'code', 'otp']
})
export class VerifyMobileOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { otp, phone, code, userId } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const userDetails = await this.context.sequelize.models.user.findOne({ where: { id: userId }, attributes: ['id', 'phoneVerified', 'phone', 'newOtpRequested', 'phoneCode', 'phoneOtp'], transaction })
      if (!userDetails) return this.addError('UserDoesNotExistsErrorType')
      if (userDetails.phoneVerified) return this.addError('PhoneAlreadyVerifiedErrorType')

      const then = dayjs().subtract(10, 'minutes').toDate()
      if (then > userDetails.newOtpRequested) return this.addError('ExpiredOtpErrorType')

      if (userDetails.phoneOtp === otp) {
        userDetails.phoneVerified = true
        userDetails.phone = phone
        userDetails.phoneCode = `+${code}`
        await userDetails.save({ transaction })
        return { success: true, data: {}, message: SUCCESS_MSG.OTP_VERIFY }
      } else return this.addError('InvalidOtpErrorType')
    } catch (error) {
      throw new APIError(error)
    }
  }
}
