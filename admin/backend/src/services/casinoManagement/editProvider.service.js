import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    providerId: { type: 'string' },
    name: { type: 'object' },
    file: { type: 'object' },
    newAggregatorId: { type: 'string' }
  },
  required: ['providerId', 'adminUserId']
})

export class EditProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const file = this.args.file
    const name = this.args.name
    const newAggregatorId = this.args.newAggregatorId

    const transaction = this.context.sequelizeTransaction

    try {
      const provider = await this.context.sequelize.models.casinoProvider.findOne({ where: { id: this.args.providerId }, transaction })
      if (!provider) return this.addError('ProviderNotFoundErrorType')

      const previousData = provider.get({ plain: true })

      if (newAggregatorId) {
        const aggregator = await this.context.sequelize.models.casinoAggregator.findOne({ where: { id: newAggregatorId }, transaction })
        if (!aggregator) return this.addError('AggregatorNotFoundErrorType')

        provider.casinoAggregatorId = aggregator.id
      }
      if (name) {
        provider.name = await getLanguageWiseNameJson(name, provider.name)
        provider.changed('name', true)
      }
      if (file) {
        const fileLocation = await uploadFile(file.buffer, {
          name: `${provider.uniqueId}_${Date.now()}`,
          mimetype: file.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.providers
        })
        provider.iconUrl = fileLocation
      }

      await provider.save({ transaction })

      const modifiedData = provider.get({ plain: true })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: provider.casinoAggregatorId,
        entityType: 'casinoAggregator',
        action: 'update',
        changeTableId: provider.id,
        changeTableName: 'casino_providers',
        previousData: { provider: previousData },
        modifiedData: { provider: modifiedData },
        service: 'editProvider',
        category: tableCategoriesMapping.casino_providers
      })

      return { provider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
