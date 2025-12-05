import ServiceBase from '../../../serviceBase'

export class DeletionStatusService extends ServiceBase {
  async run () {
    let { userId } = this.args
    const {
      dbModels: {
        User: UserModel
      }
    } = this.context

    try {
      userId = userId.split('_')[1]
      const user = await UserModel.findOne({
        where: { fbUserId: userId },
        attributes: ['isActive']
      })

      if (!user) return { success: false, message: 'User Not Found!' }
      if (!user.isActive) { return { success: true, msg: 'User is deleted' } }

      return { success: false, message: 'User Not Found!' }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
