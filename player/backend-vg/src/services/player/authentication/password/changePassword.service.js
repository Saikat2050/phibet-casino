import ServiceBase from '../../../serviceBase'
import { updateEntity } from '../../../../utils/crud'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { SIGN_UP_METHOD } from '../../../../utils/constants/constant'
import { plus } from 'number-precision'
import {
  encryptPassword,
  comparePassword,
  validatePassword,
  liveLogoutUser
} from '../../../../utils/common'
import socketServer from '../../../../libs/socketServer'

export class ChangePasswordService extends ServiceBase {
  async run () {
    const { oldPassword, newPassword, res } = this.args
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    if (
      user.moreDetails.loginMethod === SIGN_UP_METHOD.FACEBOOK ||
      user.moreDetails.loginMethod === SIGN_UP_METHOD.GOOGLE ||
      user.moreDetails.loginMethod === SIGN_UP_METHOD.APPLE
    ) {
      return this.addError('ActionNotAllowedErrorType')
    }

    if (!validatePassword(oldPassword)) {
      return this.addError('PasswordValidationFailedError')
    }

    if (!validatePassword(newPassword)) {
      return this.addError('PasswordValidationFailedError')
    }

    if (
      Buffer.from(oldPassword, 'base64').toString('utf-8') ===
      Buffer.from(newPassword, 'base64').toString('utf-8')
    ) {
      return this.addError('SamePasswordErrorType')
    }

    if (!user) {
      return this.addError('UserNotExistsErrorType')
    }
    if (+user.passwordAttempt > 4) {
      await socketServer.redisClient.del(`user:${this.context.req.body.uniqueId}`)
      await socketServer.redisClient.del(`gamePlay-${this.context.req.body.uniqueId}`)
      res.cookie('accessToken', '', { expires: new Date(0) })
      liveLogoutUser(this.context.req.body.user)
      return this.addError('MaxResetPasswordAttemptErrorType')
    }

    if (!(await comparePassword(oldPassword, user.password))) {
      await UserModel.update(
        { passwordAttempt: +plus(+user.passwordAttempt, 1) },
        {
          where: {
            userId: +user.userId
          }
        }
      )
      return this.addError('InvalidOldPasswordErrorType')
    }

    await updateEntity({
      model: UserModel,
      data: { password: encryptPassword(newPassword) },
      values: { uniqueId: user.uniqueId, userId: user.userId },
      transaction
    })

    return { success: true, data: {}, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
