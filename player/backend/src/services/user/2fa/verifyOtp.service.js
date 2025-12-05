import ajv from '@src/libs/ajv'
import * as OTPAuth from 'otpauth'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { TWO_FACTOR_AUTH } from '@src/utils/constants/public.constants.utils'
import bcrypt from 'bcrypt'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    token: { type: 'string' },
    userId: { type: 'string' },
    password: { type: 'string' },
    isPasswordCheck: { type: 'boolean', default: false }
  },
  required: ['token', 'userId']
})

export class VerifyOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { password, isPasswordCheck } = this.args

    try {
      let verified
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: this.args.userId },
        attributes: ['id', 'email', 'authEnable', 'authSecret', 'password'],
        include: {
          model: this.context.sequelize.models.wallet,
          separate: true,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.currency,
            where: { isActive: true },
            required: true
          }
        },
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (isPasswordCheck) {
        if (!password) return this.addError('PasswordRequiredErrorType')
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          return this.addError('WrongPasswordErrorType')
        }
      }

      const authSecret = user.authSecret

      const totp = new OTPAuth.TOTP({
        issuer: user.email,
        label: 'Phibet',
        algorithm: TWO_FACTOR_AUTH.algorithm,
        digits: TWO_FACTOR_AUTH.digits,
        period: TWO_FACTOR_AUTH.period,
        secret: authSecret
      })

      const delta = totp.validate({ token: this.args.token })
      if (delta !== null) {
        verified = true
      } else return this.addError('OtpVerificationFailedErrorType')

      if (verified) {
        user.authEnable = true
        await user.save({ transaction })
      }

      return { user, verified, success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
