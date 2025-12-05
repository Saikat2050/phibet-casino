import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    labelId: { type: 'string' }
  },
  required: ['labelId']
})

export class DeleteDocumentLabelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { labelId } = this.args
    const { sequelize } = this.context
    const { documentLabel } = sequelize.models
    const transaction = await sequelize.transaction()

    try {
      const label = await documentLabel.findByPk(labelId, { transaction })

      if (!label) {
        await transaction.rollback()
        return this.addError('DocumentLabelNotFoundError', 'Document label not found')
      }

      // Check if the label is being used by any documents before deleting
      const { userDocument } = sequelize.models
      const documentsUsingLabel = await userDocument.count({
        where: {
          document_label_id: labelId
        },
        transaction
      })

      if (documentsUsingLabel > 0) {
        await transaction.rollback()
        return this.addError('DocumentLabelInUseError', 'Cannot delete document label as it is being used by existing documents')
      }

      await label.destroy({ transaction })
      await transaction.commit()

      return {
        result: {
          message: 'Document label deleted successfully',
          deletedLabelId: labelId
        }
      }

    } catch (err) {
      await transaction.rollback()
      return this.addError('DeleteDocumentLabelError', err?.message || 'Unknown error occurred while deleting document label')
    }
  }
}

export default DeleteDocumentLabelService
