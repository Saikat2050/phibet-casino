import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    documentId: { type: 'number' }
  },
  required: ['userId','documentId']
})
export class GetUserDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }
  async run () {
    console.log("getting into getdocumentsdata", this.args)
    const { userId, documentId} = this.args
    const { sequelize } = this.context
    const { userDocument, documentLabel } = sequelize.models
    try {


      // const offset = (page - 1) * limit
      const document = await userDocument.findOne({
        where: {
          id: documentId,
          userId: userId
        },
        include: [{
          model: documentLabel,
          as: 'documentLabel',
          attributes: ['id', 'name', 'description', 'isRequired', 'kycLevel']
        }]
      })

      // console.log("getting data",document)
      // const totalPages = Math.ceil(documents.count / limit)
      // console.log("getting data totalPages",documents.rows )

      return {

        document: document|| [],

      }
    } catch (error) {
      return this.addError('GetUserDocumentsError', error.message)
    }
  }
}
export default GetUserDocumentService;
