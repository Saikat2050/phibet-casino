import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { DOCUMENT_STATUS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    docStatus: { 
      type: 'string',
      enum: Object.values(DOCUMENT_STATUS)
    },    
    kycStatus: { 
      type: 'string',
      enum: Object.values(KYC_STATUS)
    }, 
    documentLabelId: { type: ['number', 'null'] },
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 },
    userId: { type: ['number', 'null'] }
  }
})


export class GetKycDocumentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      docStatus,
      kycStatus,
      documentLabelId,
      page = 1,
      limit = 20,
      userId
    } = this.args
    try {
      // console.log("argscominghere",this.args)
      const where = {}

      // Only apply filter if status is explicitly provided
      if (docStatus !== null && docStatus !== undefined) {
        const validDocStatuses = Object.values(DOCUMENT_STATUS)
        if (!validDocStatuses.includes(docStatus)) {
          throw new BadRequestError(`Invalid document status: ${docStatus}`)
        }
        where.status = docStatus
      }
      // where.status = docStatus
      if (documentLabelId !== null && documentLabelId !== undefined) {
        where.documentLabelId = documentLabelId
      }

      if (userId !== null && userId !== undefined) {
        where.userId = userId
      }
      // console.log("cominggetdocs 1")
      const userWhere = {}
      if (kycStatus !== null && kycStatus !== undefined) {
        const validKycStatuses = Object.values(KYC_STATUS)
        if (!validKycStatuses.includes(kycStatus)) {
          throw new BadRequestError(`Invalid KYC status: ${kycStatus}`)
        }
        userWhere.kycStatus = kycStatus
      }
      // userWhere.kycStatus = kycStatus
      const offset = (page - 1) * limit
      console.log("cominggetdocs 2", where)

      const { count, rows: documents } = await sequelize.models.userDocument.findAndCountAll({
        where,
        include: [
          {
            model: sequelize.models.user,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'kycStatus', 'kycLevel'],
            where: Object.keys(userWhere).length > 0 ? userWhere : undefined
          },
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
        order: [['createdAt', 'ASC']],
        limit,
        offset,
        transaction
      })
      // console.log("cominggetdocs 3")

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
          hasNextPage,
          hasPrevPage
        }
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
