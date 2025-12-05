import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { emitLogOut } from '@src/socket-resources/emitters/logout.emitter'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { SELF_EXCLUSION_TYPES, USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES } from '@src/utils/constants/public.constants.utils'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  anyOf: [{
    type: 'object',
    properties: {
      adminUserId: { type: 'string' },
      userId: { type: 'string' },
      expireIn: { type: 'number' },
      value: { type: 'string', enum: [SELF_EXCLUSION_TYPES.TEMPORARY, SELF_EXCLUSION_TYPES.PERMANENT] },
      reset: { type: 'boolean' }
    },
    required: ['userId', 'expireIn']
  }]
})

export class UpdateSelfExclusionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, reset, value } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const userLimit = await this.context.sequelize.models.userLimit.findOne({
        where: { userId, key: USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.SELF_EXCLUSION },
        transaction
      })
      if (!userLimit) return this.addError('LimitDoesNotExistsErrorType')

      const previousData = {
        value: userLimit.value,
        expireAt: userLimit.expireAt
      }

      const limitData = reset ? { value: '', expireAt: null } : { value, expireAt: this.expireAt }
      if (!reset) emitLogOut(userId, { logout: true, expireAt: limitData?.expireAt })

      userLimit.value = limitData.value
      userLimit.expireAt = limitData.expireAt
      await userLimit.save({ transaction })

      const modifiedData = {
        value: userLimit.value,
        expireAt: userLimit.expireAt
      }

      if (value === SELF_EXCLUSION_TYPES.PERMANENT) {
        await this.context.sequelize.models.user.update({ isActive: !!(reset) }, { where: { id: userId }, transaction })
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: userLimit?.id,
        entityType: 'user',
        action: 'update',
        changeTableId: userLimit?.id,
        changeTableName: 'users',
        previousData: { selfExclusionLimits: previousData },
        modifiedData: { selfExclusionLimits: modifiedData },
        service: 'updateSelfExclusion',
        category: tableCategoriesMapping.users
      })

      return { userLimit }
    } catch (error) {
      throw new APIError(error)
    }
  }

  get expireAt () {
    if (this.args.value === SELF_EXCLUSION_TYPES.PERMANENT) return null
    else if (!this.args.expireIn) return null
    return serverDayjs().add(this.args.expireIn, 'd')
  }
}
