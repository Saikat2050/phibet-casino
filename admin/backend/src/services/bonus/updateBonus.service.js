import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'
import { CreateFreespinBonusService } from '@src/services/bonus/createFreespinBonus.service'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import _ from 'lodash'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { Op } from 'sequelize'
import { DEPOSIT_BONUS_PARTS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    bonusId: { type: 'string' },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          amount: { type: 'number' },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minBetAmount: { type: 'number' },
          minDepositAmount: { type: 'number' }
        },
        required: ['currencyId', 'zeroOutThreshold'],
        additionalProperties: false
      }
    },
    isActive: { type: ['string', 'boolean'] },
    validFrom: { type: 'string' },
    validTo: { type: 'string' },
    validOnDays: { type: 'string' },
    description: { type: 'object' },
    daysToClear: { type: 'string' },
    termAndCondition: { type: 'object' },
    promotionTitle: { type: 'object' },
    visibleInPromotions: { type: 'boolean' },
    tagIds: { type: 'array' },
    purchaseRequired: { type: 'boolean' },
    moreDetails:{type: 'object' }
  },
  required: ['bonusId']
})
const constraintsDeposit = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    moreDetails: {
      type: 'object',
      properties: {
        purchaseRequired: { type: 'boolean' },
        maxDeposits: { type: 'integer', minimum:  DEPOSIT_BONUS_PARTS.length, maximum: DEPOSIT_BONUS_PARTS.length },
        deposits: {
          type: 'array',
          minItems: 1,
          maxItems: DEPOSIT_BONUS_PARTS.length,
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', enum: Object.values(DEPOSIT_BONUS_PARTS) },
              isPercentage: { type: 'boolean' },
              amount: { type: 'number', minimum: 1 },
              minimumDeposit: { type: ['number', 'null'], minimum: 0 }
            },
            required: ['name', 'isPercentage', 'amount'],
            additionalProperties: false
          }
        }
      },
      required: ['purchaseRequired', 'deposits'],
      additionalProperties: false
    },
    isActive: { type: ['string', 'boolean'] },
    validFrom: { type: 'string' },
    validTo: { type: 'string' },
    validOnDays: { type: 'string' },
    description: { type: 'object' },
    daysToClear: { type: 'string' },
    termAndCondition: { type: 'object' },
    promotionTitle: { type: 'object' },
    visibleInPromotions: { type: 'boolean' },
    tagIds: { type: 'array' },
    purchaseRequired: { type: 'boolean' },  },
    adminUserId: { type: 'string' },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          amount: { type: 'number' },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minBetAmount: { type: 'number' },
          minDepositAmount: { type: 'number' }
        },
        required: ['currencyId', 'zeroOutThreshold'],
        additionalProperties: false
      }
    },
  required: ['bonusId', 'moreDetails']
})

const BONUS_SERVICE_MAP = {
  [BONUS_TYPES.FREESPINS]: CreateFreespinBonusService
}

export class UpdateBonusService extends ServiceBase {
  get constraints() {
    // If we already know bonus type from args, we can decide here
    if (this.args.bonusType === BONUS_TYPES.DEPOSIT) {
      return constraintsDeposit
    }
    return constraints
  }

  async run () {
    const bonusId = this.args.bonusId
    const validOnDays = this.args.validOnDays
    const daysToClear = this.args.daysToClear
    const visibleInPromotions = this.args.visibleInPromotions
    const transaction = this.context.sequelizeTransaction
    const purchaseRequired = this.args.purchaseRequired
    const validFrom = this.args.validFrom
    const validTo = this.args.validTo
    try {
      const bonus = await sequelize.models.bonus.findOne({
        where: { id: bonusId },
        transaction
      })
      const previousData = bonus.get({ plain: 'true' })
      if (!bonus) return this.addError('BonusDoesNotExistsErrorType')
      // const validator = bonus.bonusType === BONUS_TYPES.DEPOSIT
      //     ? constraintsDeposit
      //     : constraints

      // if (!validator(this.args)) {
      //     return this.addError('ValidationError', { errors: validator.errors })
      //   }
      bonus.promotionTitle = _.merge(bonus.promotionTitle, await getLanguageWiseNameJson(this.args.promotionTitle))
      bonus.termAndCondition = _.merge(bonus.termAndCondition, await getLanguageWiseNameJson(this.args.termAndCondition))
      bonus.description = _.merge(bonus.description, await getLanguageWiseNameJson(this.args.description))
      bonus.changed('promotionTitle', true)
      bonus.changed('termAndCondition', true)
      bonus.changed('description', true)
      bonus.visibleInPromotions = visibleInPromotions
      if (typeof this.args.isActive === 'string') bonus.isActive = JSON.parse(this.args.isActive)
      else bonus.isActive = this.args.isActive

      if (this.args.currencyDetails) {
        const currencyDetails = await Promise.all(this.args.currencyDetails.map(async (currency) => {
          if (await this.context.sequelize.models.currency.findOne({ where: { id: currency.currencyId } })) {
            currency.bonusId = bonus.id
            return currency
          }
          return null
        }))

        if (_.includes(currencyDetails, null)) return this.addError('InvalidCurrencyDetailsErrorType')
        await this.context.sequelize.models.bonusCurrency.bulkCreate(currencyDetails, {
          updateOnDuplicate: ['zeroOutThreshold', 'amount', 'maxBonusClaimed', 'minBetAmount', 'minDepositAmount'],
          transaction
        })
      }

      bonus.validFrom =validFrom || null
      bonus.validTo = validTo || null
      bonus.validOnDays = validOnDays || bonus.validOnDays
      bonus.daysToClear = daysToClear || bonus.daysToClear
      bonus.tagIds = this.args.tagIds || bonus.tagIds
      bonus.moreDetails = { 
        ...bonus.moreDetails, 
        ...this.args.moreDetails, 
        purchaseRequired 
      }
      const result = await BONUS_SERVICE_MAP[bonus.bonusType]?.execute({ ...this.args, bonusId: bonus.id }, this.context)
      if (_.size(result?.errors)) return this.mergeErrors(result.errors)

      await bonus.save({ transaction })

      if (bonus.bonusType === BONUS_TYPES.DAILY_BONUS) {
        const dailyBonus = await this.context.sequelize.models.bonus.findOne({
          where: {
            bonusType: BONUS_TYPES.DAILY_BONUS,
            isActive: true
          },
          include: {
            model: this.context.models.bonusCurrency,
            include: {
              model: this.context.models.currency,
              where: { code: { [Op.in]: ['GC', 'BSC'] } },
              required: true
            }
          }
        })

        await Cache.set(CACHE_KEYS.DAILY_BONUS, dailyBonus)
      } else if (bonus.bonusType === BONUS_TYPES.WELCOME) {
        const welcomeBonus = await this.context.sequelize.models.bonus.findOne({
          attributes: ['id', 'claimedCount', 'moreDetails'],
          where: {
            bonusType: BONUS_TYPES.WELCOME,
            isActive: true
          },
          include: {
            model: this.context.models.bonusCurrency,
            include: {
              model: this.context.models.currency,
              where: { code: { [Op.in]: ['GC', 'BSC'] } },
              required: true
            }
          },
          transaction
        })

        await Cache.set(CACHE_KEYS.WELCOME, welcomeBonus)
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: bonus.id,
        entityType: 'bonus',
        action: 'update',
        changeTableId: bonus.id,
        changeTableName: 'bonus',
        previousData: { bonus: previousData },
        modifiedData: { bonus: bonus.get({ plain: 'true' }) },
        service: 'updateBonus',
        category: tableCategoriesMapping.bonus
      })

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
