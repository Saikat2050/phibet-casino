import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { JoiningBonusService } from '@src/services/bonus/joiningBonus.service'
import _ from 'lodash'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    adminUserId: { type: 'string' }
  },
  required: ['userId', 'adminUserId']
})

export class VerifyEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    try {
      const user = await sequelize.models.user.findOne({
        where: { id: this.args.userId },
        attributes: ['id', 'email', 'emailVerified', 'username'],
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')

      if (user.emailVerified) return this.addError('EmailAlreadyVerifiedErrorType')
      const previousData = user.emailVerified

      try {
        const data = await JoiningBonusService.execute({
          userId: user.id,
          adminUserId: this.args.adminUserId
        }, this.context)
        if (_.size(data?.result?.errors)) throw new APIError(data?.result?.errors)
      } catch (error) {
        Logger.error(`Error IN BONUS USER_ID ${user.id}`, error)
      }

      await user.set({ emailVerified: true }).save({ transaction })
      const modifiedData = user.emailVerified

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: user?.id,
        entityType: 'user',
        action: 'update',
        changeTableId: user?.id,
        changeTableName: 'users',
        previousData: { emailVerified: previousData },
        modifiedData: { emailVerified: modifiedData },
        service: 'verifyEmail',
        category: tableCategoriesMapping.users
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
