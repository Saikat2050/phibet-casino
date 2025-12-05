import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { DEPOSIT_BONUS_PARTS } from '@src/utils/constants/public.constants.utils'

const depositPartsLength = Object.values(DEPOSIT_BONUS_PARTS).length

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string', minLength: 1 },
    percentage: { type: 'number', minimum: 0, maximum: 100 },
    moreDetails: {
      type: 'object',
      properties: {
        maxDeposits: { type: 'integer', const: depositPartsLength },
        deposits: {
          type: 'array',
          minItems: depositPartsLength,
          maxItems: depositPartsLength,
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', enum: Object.values(DEPOSIT_BONUS_PARTS) },
              isPercentage: { type: 'boolean' },
              amount: { type: 'number', minimum: 0 },
              minimumDeposit: { 
                anyOf: [
                  { type: 'number', minimum: 0 },
                  { type: 'null' }
                ]
              }
            },
            required: ['name', 'isPercentage', 'amount', 'minimumDeposit'],
            additionalProperties: false
          }
        }
      },
      required: ['maxDeposits', 'deposits'],
      additionalProperties: false
    },
    currencyDetails: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string', minLength: 1 },
          maxBonusClaimed: { type: 'number', minimum: 1 },
          minDepositAmount: { type: 'number', minimum: 1 }
        },
        required: ['currencyId', 'minDepositAmount'],
        additionalProperties: false
      }
    }
  },
  required: ['bonusId', 'moreDetails', 'currencyDetails'],
  additionalProperties: false
})

export class CreateDepositBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { bonusId, percentage, moreDetails, currencyDetails } = this.args

    try {
      const bonus = await this.context.sequelize.models.depositBonus.upsert(
        {
          bonusId,
          percentage,
          moreDetails,
          currencyDetails
        },
        { transaction: this.context.sequelizeTransaction }
      )

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
