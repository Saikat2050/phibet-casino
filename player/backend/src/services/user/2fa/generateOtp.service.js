import ajv from '@src/libs/ajv'
import * as OTPAuth from 'otpauth'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { generateRandomBase32 } from '@src/helpers/common.helper'
import { TWO_FACTOR_AUTH } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GenerateOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    try {
      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'email', 'authSecret'],
        where: { id: this.args.userId },
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const label = 'Phibet'
      const email = user.email
      const authSecret = generateRandomBase32()

      const totp = new OTPAuth.TOTP({
        issuer: email,
        label: label,
        algorithm: TWO_FACTOR_AUTH.algorithm,
        digits: TWO_FACTOR_AUTH.digits,
        period: TWO_FACTOR_AUTH.period,
        secret: authSecret
      })

      const authUrl = totp.toString()
      user.authSecret = authSecret
      user.authUrl = authUrl
      await user.save({ transaction })

      return { authSecret: authSecret, authUrl: authUrl, period: TWO_FACTOR_AUTH.period }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
