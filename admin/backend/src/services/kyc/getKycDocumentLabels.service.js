import { sequelize } from '@src/database/models'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isRequired: { type: 'boolean' },
    isActive: { type: 'boolean' },
    pageNo: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1, maximum: 100 }
  },
  required: []
})

export class GetKycDocumentLabelsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isRequired, isActive = true, pageNo = 1, limit = 20 } = this.args

    const { sequelize } = this.context
    const { documentLabel } = sequelize.models

    try {
      const whereClause = {}
      if (isActive !== undefined) whereClause.isActive = isActive
      if (isRequired !== undefined) whereClause.isRequired = isRequired

      const offset = (pageNo - 1) * limit

      const { rows: labels, count: total } = await documentLabel.findAndCountAll({
        where: whereClause,
        order: [['id', 'ASC'], ['name', 'ASC']],
        limit,
        offset
      })

      return {
        result: {
          labels,
          pagination: {
            total,
            pageNo,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      }
    } catch (error) {
      return this.addError('GetDocumentLabelsError', error.message)
    }
  }
}

