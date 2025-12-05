import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    // kycLevel: { type: 'number' },
    isRequired: { type: 'boolean' }


  },
  required: ['userId']
})
export class GetDocumentLabelsService extends ServiceBase {
  get constraints () {
    return constraints
  }
  async run () {
    const { isRequired } = this.args

    const { sequelize } = this.context
    const { documentLabel } = sequelize.models
    try {
      const whereClause = { isActive: true }
      // if (kycLevel !== undefined) whereClause.kycLevel = kycLevel
      if (isRequired !== undefined) whereClause.isRequired = isRequired
      const labels = await documentLabel.findAll({
        where: whereClause,
        order: [['id', 'ASC'], ['name', 'ASC']]
      })
      return { result: { labels } }
    } catch (error) {
      return this.addError('GetDocumentLabelsError', error.message)
    }
  }
}
export default GetDocumentLabelsService;
