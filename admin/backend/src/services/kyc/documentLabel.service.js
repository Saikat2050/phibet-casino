import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { sequelize } from '@src/database/models'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    isRequired: { type: 'boolean' },
    isActive: { type: 'boolean' },
    labelId: { type: ['number', 'null'] } // if present, edit; else, create
  },
  required: []
})

export class UpsertDocumentLabelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { name, description, isRequired, isActive, labelId } = this.args
    const { sequelize } = this.context
    const { documentLabel } = sequelize.models
    const transaction = await sequelize.transaction()

    try {

      if (labelId) {
        // Edit case
        const label = await documentLabel.findOne({
          where: { id: labelId, isActive: true },
          transaction
        })
        console.log("findlabelwith id",label)
        if (!label) {
          await transaction.rollback()
          return this.addError('DocumentLabelNotFoundError')
        }
        console.log("findlabelwith id 2")
        if (name) {
          const normalizedName = name.trim().toLowerCase()

          const conflictingLabel = await documentLabel.findOne({
          where: {
            name: sequelize.where(
              sequelize.fn('lower', sequelize.col('name')),
              normalizedName
            ),
            id: { [sequelize.Op.ne]: labelId }
          },
          transaction
        })
         console.log("findlabelwith id 3")

        if (conflictingLabel) {
          await transaction.rollback()
          return this.addError('DocumentLabelAlreadyExistsErrorType')
        }
        }
        // Check if another label already uses the same normalized name
        
       
        console.log("findlabelwith id 4")

        // Update the label
        await label.update({
          name,
          description,
          isRequired: isRequired,
          isActive: isActive
        }, { transaction })

        await transaction.commit()
        console.log("findlabelwith id 5")

        return {
          result: {
            message: 'Document label updated',
            label
          }
        }

      } else {
        // Create case
        const normalizedName = name.trim().toLowerCase()

        const existingLabel = await documentLabel.findOne({
          where: sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            normalizedName
          ),
          transaction
        })

        if (existingLabel) {
          await transaction.rollback()
          return this.addError('DocumentLabelAlreadyExistsErrorType')
        }

        const newLabel = await documentLabel.create({
          name: normalizedName,
          description,
          isRequired: isRequired,
          isActive: isActive,
          kycLevel: 3
        }, { transaction })

        await transaction.commit()

        return {
          result: {
            message: 'Document label created',
            label: newLabel
          }
        }
      }

    } catch (err) {
      await transaction.rollback()
      return this.addError('UpsertDocumentLabelError', err?.message || 'Unknown error')
    }
  }
}

export default UpsertDocumentLabelService
