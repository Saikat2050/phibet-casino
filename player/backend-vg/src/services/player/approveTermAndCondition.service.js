import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class ApproveTermAndConditionService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { isTermsAccepted } = this.args

    try {
      if (!isTermsAccepted) return this.addError('TermsAndConditionErrorType')

      await UserModel.update(
        { isTermsAccepted: true },
        {
          where: {
            userId: user.userId
          },
          transaction
        }
      )

      return {
        status: 200,
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
