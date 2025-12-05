import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TWO_FACTOR_AUTH } from '../../utils/constants/constant'
import * as OTPAuth from 'otpauth'
import { comparePassword } from '../../utils/common'
import ServiceBase from '../serviceBase'

const schema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    password: { type: ['string', 'null'] },
    callService: { type: ['string'] }
  },
  required: ['token']
}
const constraints = ajv.compile(schema)

export class Verify2FAOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context
    const user = this.context.req.user.detail
    const { token, password = null, callService } = this.args
    let verified
    const email = user.dataValues.email
    try {
      const userExist = await UserModel.findOne({
        attributes: ['authSecret', 'authUrl', 'password', 'signInMethod'],
        where: { userId: user.userId }
      })
      if (!userExist) {
        return callService
          ? { error: true, message: 'UserNotExistsErrorType' }
          : this.addError('UserNotExistsErrorType')
      }
      if (!userExist.authUrl) {
        return callService
          ? { error: true, message: 'UserTwoFactorAuthIsDisabledErrorType' }
          : this.addError('UserTwoFactorAuthIsDisabledErrorType')
      }
      // verify user password
      if (password) {
        if (!userExist?.password) {
          return callService
            ? { error: true, message: 'PasswordNotExistErrorType' }
            : this.addError('PasswordNotExistErrorType')
        }

        if (!(await comparePassword(password, userExist?.password))) {
          return callService
            ? { error: true, message: 'IncorrectPasswordErrorType' }
            : this.addError('IncorrectPasswordErrorType')
        }
      }
      const authSecret = userExist.dataValues.authSecret
      const totp = new OTPAuth.TOTP({
        issuer: email,
        label: 'vegasCoins',
        algorithm: TWO_FACTOR_AUTH.algorithm,
        digits: TWO_FACTOR_AUTH.digits,
        period: TWO_FACTOR_AUTH.period,
        secret: authSecret
      })

      const delta = totp.validate({ token })
      if (delta !== null) {
        verified = true
      } else {
        return callService
          ? {
              error: true,
              message: 'YourTwoFactorAuthCodeIsIncorrectErrorType'
            }
          : this.addError('YourTwoFactorAuthCodeIsIncorrectErrorType')
      }

      if (verified) {
        await UserModel.update(
          { authEnable: true },
          {
            where: { userId: user.userId },
            transaction: transaction
          }
        )
      }
      return {
        verified,
        success: true,
        message: SUCCESS_MSG.VERIFY_2FA_SUCCESS
      }
    } catch (error) {
      console.log('Error Occur in Verify2FAOtpService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
