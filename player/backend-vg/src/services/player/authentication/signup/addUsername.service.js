import * as jwt from 'jsonwebtoken'
import ServiceBase from '../../../serviceBase'
import { sequelize } from '../../../../db/models'
import config from '../../../../configs/app.config'
import { REGEX } from '../../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../../utils/constants/success'

export class AddUserNameService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel
      },
      req: {
        headers: { cookie }
      }
    } = this.context

    const { username } = this.args

    // Verify if user is authenticated

    const token = cookie?.split('accessToken=')[1]?.split(';')[0]

    if (!token) return this.addError('UnAuthorizeUserErrorType')

    const decodedToken = jwt.verify(token, config.get('jwt.loginTokenSecret'))

    if (!decodedToken) return this.addError('UnAuthorizeUserErrorType')

    const detail = await UserModel.findOne({
      attributes: ['isActive', 'username', 'userId', 'isBan'],
      where: { userId: decodedToken?.id }
    })

    if (!detail) return this.addError('UnAuthorizeUserErrorType')
    if (!detail.isActive) return this.addError('UserInActiveErrorType')
    if (detail.username) return this.addError('UserNameExistErrorType')
    if (detail.isBan) return this.addError('UserBanErrorType')

    // Adding username to the user
    if (!REGEX.USERNAME.test(username)) return this.addError('PatternDoesNotMatchErrorType')

    const isUserNameExist = await UserModel.findOne({
      attributes: [[sequelize.literal('1'), 'exists']],
      where: {
        username: username
      },
      raw: true
    })

    if (isUserNameExist) return this.addError('UserNameExistErrorType')

    await UserModel.update(
      {
        username: username
      },
      {
        where: {
          userId: detail.userId
        }
      }
    )

    return {
      success: SUCCESS_MSG.UPDATE_SUCCESS,
      username,
      userId: detail.userId
    }
  }
}
