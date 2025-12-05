import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    name: { type: 'object' },
    mobileFile: { type: 'object' },
    desktopFile: { type: 'object' },
    aggregatorId: { type: 'string' },
    uniqueId: { type: 'string' },
    isActive: { type: 'boolean', default: true }
  },
  required: ['name', 'uniqueId', 'aggregatorId']
})

export class CreateProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const mobileFile = this.args.mobileFile
    const desktopFile = this.args.desktopFile
    const uniqueId = this.args.uniqueId
    const aggregatorId = this.args.aggregatorId

    const transaction = this.context.sequelizeTransaction
    const casinoProviderModel = this.context.sequelize.models.casinoProvider
    try {
      const ProviderExists = await casinoProviderModel.findOne({ where: { [Op.or]: { 'name.EN': this.args.name.EN, uniqueId } }, transaction })
      if (ProviderExists) return this.addError('ProviderAlreadyExistsErrorType')
      let fileLocation = ''
      const name = await getLanguageWiseNameJson(this.args.name)
      const provider = await casinoProviderModel.create({
        name,
        uniqueId,
        casinoAggregatorId: aggregatorId,
        isActive: this.args.isActive
      }, { transaction })

      if (mobileFile && Object.keys(mobileFile).length > 0) {
        fileLocation = await uploadFile(mobileFile.buffer, {
          name: `category_mobile_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: mobileFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.providers
        })
        provider.mobileThumbnailUrl = fileLocation
      }

      if (desktopFile && Object.keys(desktopFile).length > 0) {
        fileLocation = await uploadFile(desktopFile.buffer, {
          name: `category_desktop_${dayjs().format('YYYYMMDD_HHmmss')}`,
          mimetype: desktopFile.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.casino.providers
        })
        provider.iconUrl = fileLocation
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: aggregatorId,
        entityType: 'casinoAggregator',
        action: 'create',
        changeTableId: provider?.id,
        changeTableName: 'casino_providers',
        previousData: { provider: null },
        modifiedData: { provider: provider?.get({ plain: true }) },
        service: 'create Provider',
        category: tableCategoriesMapping.casino_providers
      })

      await provider.save({ transaction })

      return { provider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
