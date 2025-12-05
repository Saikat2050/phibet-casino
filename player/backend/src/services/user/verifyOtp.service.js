import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { Cache } from '@src/libs/cache'
import { CACHE_STORE_SUFFIXES } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    email: { type: 'string' },
    otp: { type: 'string' }
  },
  required: ['email', 'otp']
})

export class VerifyOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const email = this.args.email
      const otp = this.args.otp
      const otpDetails = await Cache.get(`${email}${CACHE_STORE_SUFFIXES.VERIFY_OTP}`)
      if (!otpDetails) {
        return
      }
      if (otpDetails.otp !== otp) {
        Cache.del(`${email}${CACHE_STORE_SUFFIXES.VERIFY_OTP}`)
        return
      }
      return otpDetails
    } catch (error) {
      throw new APIError(error)
    }
  }
}
