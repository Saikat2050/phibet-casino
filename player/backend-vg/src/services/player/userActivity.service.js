import ajv from '../../libs/ajv'
import ServiceBase from '../../services/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    activityType: { type: 'string' },
    userId: { type: 'number' },
    createdAt: {},
    ipAddress: { type: ['string', 'null'] }
  },
  required: ['activityType', 'userId']
}

const constraints = ajv.compile(schema)

export class UserActivityService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { UserActivities: UserActivitiesModel },
      sequelizeTransaction
    } = this.context

    const { activityType, userId, ipAddress } = this.args
    let data

    const transaction = sequelizeTransaction ? { transaction: sequelizeTransaction } : {}

    try {
      if (activityType === USER_ACTIVITIES_TYPE.LOGOUT) {
        const lastLogin = await UserActivitiesModel.findOne({
          where: { userId, activityType: USER_ACTIVITIES_TYPE.LOGIN },
          attributes: ['uniqueId'],
          order: [['userActivityId', 'DESC']],
          ...transaction
        })

        if (!lastLogin) return { success: false, message: SUCCESS_MSG.GET_SUCCESS }
        data = { uniqueId: lastLogin?.uniqueId }
      }

      await UserActivitiesModel.create(
        {
          activityType,
          ipAddress,
          ...data,
          userId
        },
        transaction
      )

      return { success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('Error in User Activity Service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
