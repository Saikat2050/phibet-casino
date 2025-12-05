import ServiceBase from '../serviceBase'
import * as OTPAuth from 'otpauth'
import { generateRandomBase32 } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TWO_FACTOR_AUTH } from '../../utils/constants/constant'

export class Generate2FAOtpService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context
    const user = this.context.req.user.detail
    let label

    const email = user.email
    const authSecret = generateRandomBase32()
    try {
      label = 'vegasCoins'
      const userExist = await UserModel.findOne({
        where: { userId: user.userId }
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      const totp = new OTPAuth.TOTP({
        issuer: email,
        label: label,
        algorithm: TWO_FACTOR_AUTH.algorithm,
        digits: TWO_FACTOR_AUTH.digits,
        period: TWO_FACTOR_AUTH.period,
        secret: authSecret
      })

      const authUrl = totp.toString()

      await UserModel.update(
        {
          authSecret: authSecret,
          authUrl: authUrl
        },
        {
          where: { userId: user.userId },
          transaction: transaction
        }
      )
      return {
        result: {
          authSecret: authSecret,
          authUrl: authUrl,
          period: TWO_FACTOR_AUTH.period
        },
        success: true,
        message: SUCCESS_MSG.GENERATE_2FA_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
