import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'

export class DisableAuthService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const user = this.context.req.user.detail
    try {
      const userExist = await UserModel.findOne({
        where: { userId: user.userId }
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')
      await UserModel.update(
        {
          authEnable: false,
          authSecret: null,
          authUrl: null
        },
        {
          where: { userId: user.userId },
          transaction
        })

      return { result: { authEnable: false }, success: true, message: SUCCESS_MSG.AUTH_DISABLE }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
