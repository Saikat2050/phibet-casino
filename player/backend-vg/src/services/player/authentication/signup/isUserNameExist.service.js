import ServiceBase from '../../../serviceBase'
import { sequelize } from '../../../../db/models'
import { REGEX } from '../../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../../utils/constants/success'

export class UserNameCheckService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel }
    } = this.context

    const { username } = this.args

    if (!REGEX.USERNAME.test(username)) return this.addError('PatternDoesNotMatchErrorType')

    const isUserNameExist = await UserModel.findOne({
      attributes: [[sequelize.literal('1'), 'exists']],
      where: {
        username
      },
      raw: true
    })

    return {
      user: { isUserNameExist: !!isUserNameExist } || {},
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
