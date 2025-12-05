import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { DOCUMENT_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number' },
    docStatus: { 
      type: 'string',
      enum: Object.values(DOCUMENT_STATUS)
    },   
    documentLabelId: { type: ['number', 'null'] },
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 }
  },
  required: ['userId']
})

export class GetUserDocumentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { userId, docStatus, documentLabelId, page = 1, limit = 20 } = this.args

    try {
      // Check if user exists
      const user = await sequelize.models.user.findByPk(userId, { transaction })
      if (!user) {
        return this.addError('UserDoesNotExistsErrorType')
      }

      // Build where clause
      const where = { userId }
       // Only apply filter if status is explicitly provided
       where.status = docStatus

      if (documentLabelId) {
        where.documentLabelId = documentLabelId
      }

      // Calculate offset
      const offset = (page - 1) * limit

      // Fetch documents with pagination
      const { count, rows: documents } = await sequelize.models.userDocument.findAndCountAll({
        where,
        include: [
          {
            model: sequelize.models.documentLabel,
            as: 'documentLabel',
            attributes: ['id', 'name', 'description', 'isRequired', 'kycLevel']
          },
          {
            model: sequelize.models.adminUser,
            as: 'reviewer',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        transaction
      })

      // Calculate pagination info
      const totalPages = Math.ceil(count / limit)
      const hasNextPage = page < totalPages
      const hasPrevPage = page > 1

      return {
        success: true,
        documents,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
} 