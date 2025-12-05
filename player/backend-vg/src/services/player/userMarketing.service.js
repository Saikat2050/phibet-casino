import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UserMarketingService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { emailMarketing, smsMarketing } = this.args

    await UserModel.update(
      {
        emailMarketing,
        smsMarketing
      },
      {
        where: {
          userId: user.userId
        },
        transaction
      }
    )
    const userMarketing = await UserModel.findOne({
      attributes: ['emailMarketing', 'smsMarketing'],
      where: {
        userId: user.userId
      },
      transaction
    })
    return {
      success: true,
      data: userMarketing,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
