import config from '../../../../configs/app.config'
import { parseSignedRequest } from '../../../../utils/common'
import ServiceBase from '../../../serviceBase'

export class FacebookDataDeletionService extends ServiceBase {
  async run () {
    const { signed_request: signedRequest } = this.args
    const {
      dbModels: {
        User: UserModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const data = parseSignedRequest(signedRequest)
      if (!data) {
        return this.addError('InvalidSignedRequest')
      }
      const userId = data.user_id

      const user = await UserModel.findOne({
        where: { fbUserId: userId },
        attributes: ['isActive']
      })

      if (!user) return this.addError('UserNotExistsErrorType')

      await UserModel.update({
        isActive: false
      }, { where: { fbUserId: userId }, transaction })

      const statusUrl = `${config.get('app.url')}/api/v1/user/delete-status?userId=del_${userId}`
      const confirmationCode = `del_${userId}`

      const responseData = {
        url: statusUrl,
        confirmation_code: confirmationCode
      }

      return { success: true, responseData }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
