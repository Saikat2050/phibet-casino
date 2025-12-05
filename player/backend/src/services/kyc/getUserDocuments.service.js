import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    page: { type: 'number' },
    limit: { type: 'number' }
  },
  required: ['userId']
})
export class GetUserDocumentsService extends ServiceBase {
  get constraints () {
    return constraints
  }
  async run () {
    console.log("getting into getdocumentsdata", this.args)
    const { userId, page = 1, limit = 10 } = this.args
    const { sequelize } = this.context
    const { userDocument, documentLabel } = sequelize.models
    try {
      const whereClause = { userId }

      const offset = (page - 1) * limit
      const documents = await userDocument.findAndCountAll({
        where: whereClause,
        include: [{
          model: documentLabel,
          as: 'documentLabel',
          attributes: ['id', 'name', 'description', 'isRequired', 'kycLevel']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })
      console.log("getting data",documents)
      const totalPages = Math.ceil(documents.count / limit)
      console.log("getting data totalPages",documents.rows )

      return {

          documents: documents.rows || [],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: documents.count,
            itemsPerPage: limit

        }
      }
    } catch (error) {
      return this.addError('GetUserDocumentsError', error.message)
    }
  }
}
export default GetUserDocumentsService;
