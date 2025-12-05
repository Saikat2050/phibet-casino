import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { KYC_ACTIONS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'number' },
    userId: { type: ['number', 'null'] },
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 }
  },
  required: ['adminUserId']
})

export class GetRequestedKycService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, page = 1, limit = 20 } = this.args
    const { sequelize } = this.context
    const { kycActivityLog, user } = sequelize.models

    try {
      const offset = (page - 1) * limit

      const whereClause = {
        action: KYC_ACTIONS.KYC_VERIFICATION_REQUESTED
      }

      if (userId) {
        whereClause.userId = userId
      }

      // Step 1: Get distinct userIds with 'KYC_REQUESTED' action
      const userIdsResult = await kycActivityLog.findAll({
        where: whereClause,
        attributes: ['userId'],
        group: ['userId'],
        raw: true
      })

      const filteredUserIds = userIdsResult.map(entry => entry.userId)

      if (filteredUserIds.length === 0) {
        return {
          result: {
            users: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: limit
            }
          }
        }
      }

      // Step 2: Fetch user details whose kycStatus != 'COMPLETED'
      const usersResult = await user.findAndCountAll({
        where: {
          id: { [Op.in]: filteredUserIds },
          kycStatus: { [Op.ne]: KYC_STATUS.COMPLETED }
        },
        attributes: ['id', 'username', 'email', 'kycStatus'],
        limit,
        offset,
        order: [['id', 'DESC']]
      })

      const totalPages = Math.ceil(usersResult.count / limit)

      return {
        result: {
          users: usersResult.rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: usersResult.count,
            itemsPerPage: limit
          }
        }
      }
    } catch (error) {
      return this.addError('GetRequestedKycError', error.message)
    }
  }
}

export default GetRequestedKycService
