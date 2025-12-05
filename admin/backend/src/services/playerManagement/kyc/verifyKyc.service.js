import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    userId: { type: 'number' }
  },
  required: ['userId']
})

export class VerifyKycService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { userId } = this.args

    try {
      const user = await sequelize.models.user.findOne({
        where: { id: userId },
        attributes: ['id', 'kycStatus'],
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (user.kycStatus === KYC_STATUS.COMPLETED) return this.addError('KycAlreadyVerifiedErrorType')

      const previousData = user.kycStatus

      await user.set({ kycStatus: KYC_STATUS.COMPLETED }).save({ transaction })

      const modifiedData = user.kycStatus

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: user?.id,
        entityType: 'user',
        action: 'update',
        changeTableId: user?.id,
        changeTableName: 'users',
        previousData: { kycVerified: previousData },
        modifiedData: { kycVerified: modifiedData },
        service: 'verifyKyc',
        category: tableCategoriesMapping.users
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
