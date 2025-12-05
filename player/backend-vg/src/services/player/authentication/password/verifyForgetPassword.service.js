import Jwt from 'jsonwebtoken'
import ServiceBase from '../../../serviceBase'
import config from '../../../../configs/app.config'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import {
  comparePassword,
  encryptPassword,
  validatePassword
} from '../../../../utils/common'
import socketEmitter from '../../../../libs/socketEmitter'
import { CACHE_KEYS } from '../../../../utils/constants/constant'

export class VerifyForgetPasswordService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context
    const { newPasswordKey, password, confirmPassword } = this.args
    try {
      const globalSetting = await socketEmitter.redisClient.get(CACHE_KEYS.MAINTENANCE)
      if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

      if (!validatePassword(password)) {
        return this.addError('PasswordValidationFailedError', '')
      }

      if (
        Buffer.from(password, 'base64').toString('ascii') !==
        Buffer.from(confirmPassword, 'base64').toString('ascii')
      ) {
        return this.addError('PasswordDoesNotMatchErrorType')
      }

      const newPasswordKeyData = await Jwt.verify(
        newPasswordKey,
        config.get('jwt.resetPasswordKey')
      )
      if (!newPasswordKeyData || !newPasswordKeyData.userId) { return this.addError('ResetPasswordTokenErrorType', '') }

      const userData = await UserModel.findOne({
        attributes: [
          'userId',
          'email',
          'username',
          'uniqueId',
          'newPasswordKey',
          'password'
        ],
        where: {
          uniqueId: newPasswordKeyData.userId
        },
        raw: true,
        transaction
      })
      if (!userData) return this.addError('ResetPasswordTokenErrorType', '')
      if (userData?.newPasswordKey !== newPasswordKey) { return this.addError('ResetPasswordTokenErrorType', '') }
      if (await comparePassword(password, userData.password)) { return this.addError('PasswordCannotBeSameAsOldPasswordErrorType') }

      await UserModel.update(
        {
          password: encryptPassword(password),
          newPasswordKey: null
        },
        {
          where: {
            uniqueId: newPasswordKeyData.userId
          },
          transaction
        }
      )
      await transaction.commit()

      return { success: true, data: {}, message: SUCCESS_MSG.PASSWORD_RESET }
    } catch (error) {
      if (error && error?.message === 'jwt expired') {
        return this.addError('ResetPasswordTokenErrorType', error)
      }
      return this.addError('InternalServerErrorType', error)
    }
  }
}
