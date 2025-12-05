import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import _ from 'lodash'
import { CreateFreespinBonusService } from './createFreespinBonus.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    isActive: { type: 'boolean' },
    validTo: { type: 'string' },
    quantity: { type: 'number', minimum: 1 },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          amount: { type: 'number', minimum: 1 },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minBetAmount: { type: 'number' },
          minDepositAmount: { type: 'number' }
        },
        required: ['currencyId', 'zeroOutThreshold'],
        additionalProperties: false
      }
    },
    validFrom: { type: 'string' },
    validOnDays: { type: 'string' },
    bonusImage: { type: 'object' },
    description: { type: 'object' },
    daysToClear: { type: 'string' },
    termAndCondition: { type: 'object' },
    promotionTitle: { type: 'object' },
    percentage: { type: 'number' },
    bonusType: { enum: Object.values(BONUS_TYPES) },
    gameIds: { type: 'array' },
    tagIds: { type: 'array' },
    visibleInPromotions: { type: 'boolean' },
    purchaseRequired: { type: 'boolean' }
  },
  required: ['isActive', 'promotionTitle', 'bonusType', 'currencyDetails']
})

const BONUS_SERVICE_MAP = {
  [BONUS_TYPES.FREESPINS]: CreateFreespinBonusService
}

export class CreateBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const isActive = this.args.isActive
    const validTo = this.args.validTo
    const validFrom = this.args.validFrom
    const validOnDays = this.args.validOnDays
    const bonusImage = this.args.bonusImage
    const description = this.args.description
    const daysToClear = this.args.daysToClear
    const termAndCondition = this.args.termAndCondition
    const promotionTitle = this.args.promotionTitle
    const bonusType = this.args.bonusType
    const visibleInPromotions = this.args.visibleInPromotions
    const transaction = this.context.sequelizeTransaction
    const purchaseRequired = this.args.purchaseRequired
    try {
      if (await this.context.sequelize.models.bonus.findOne({ where: { bonusType } })) return this.addError('JoiningBonusAlreadyExistErrorType')

      if (await this.context.sequelize.models.bonus.findOne({ where: { bonusType, 'promotionTitle.EN': promotionTitle.EN } })) return this.addError('ActiveBonusExistsErrorType')

      const bonus = await this.context.sequelize.models.bonus.create({
        validTo,
        isActive,
        bonusType,
        validFrom,
        validOnDays,
        daysToClear,
        visibleInPromotions,
        tagIds: this.args.tagIds || [],
        description: await getLanguageWiseNameJson(description),
        promotionTitle: await getLanguageWiseNameJson(promotionTitle),
        termAndCondition: await getLanguageWiseNameJson(termAndCondition),
        moreDetails: purchaseRequired ? { purchaseRequired } : null
      }, {
        transaction
      })
      if (!bonus.moreDetails) {
        bonus.moreDetails = {};
      }

      const result = await BONUS_SERVICE_MAP[bonusType]?.execute({ ...this.args, bonusId: bonus.id }, this.context)
      if (_.size(result?.errors)) return this.mergeErrors(result.errors)

      const currencyDetails = await Promise.all(this.args.currencyDetails.map(async (currency) => {
        if (await this.context.sequelize.models.currency.findOne({ where: { id: currency.currencyId } })) {
          currency.bonusId = bonus.id
          return currency
        }
        return null
      }))

      if (_.includes(currencyDetails, null)) return this.addError('InvalidCurrencyDetailsErrorType')
      await this.context.sequelize.models.bonusCurrency.bulkCreate(currencyDetails, { transaction })

      if (bonusImage) {
        const fileLocation = await uploadFile(bonusImage.buffer, {
          name: `${bonus.id}_${Date.now()}`,
          mimetype: bonusImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.bonus
        })
        bonus.imageUrl = fileLocation
        await bonus.save({ transaction })
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: bonus.id,
        entityType: 'bonus',
        action: 'create',
        changeTableId: bonus.id,
        changeTableName: 'bonus',
        previousData: { bonus: null },
        modifiedData: { bonus: bonus?.get({ plain: true }) },
        service: 'createBonus',
        category: tableCategoriesMapping.bonus

      })

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
