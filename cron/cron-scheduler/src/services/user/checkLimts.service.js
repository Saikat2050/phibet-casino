import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'

export class CheckUserLimitService extends ServiceBase {
  async run () {
    try {
      const { limit, isActive, userId, activity } = this.args

      limit.value = limit.currentValue = ''
      limit.expireAt = null

      if (!isActive) {
        await sequelize.models.user.update({ isActive: true }, {
          where: { id: userId }
        })
      }

      await sequelize.models.userLimit.update({ ...limit }, { where: { userId, id: limit.id } })

      if (activity) {
        await sequelize.models.userActivity.create({
          userId,
          activityType: 'LOGIN'
        })
      }

      return { success: true }
    } catch (error) {
      return { success: false, message: 'Error in upgrade tier Service', data: null, error }
    }
  }
}
