
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    gameIds: { type: 'array' },
    quantity: { type: 'number', minimum: 1 },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          zeroOutThreshold: { type: 'number', minimum: 1, default: 1 },
          currencyId: { type: 'string' },
          maxBonusClaimed: { type: 'number', minimum: 1 }
        },
        required: ['maxBonusClaimed'],
        additionalProperties: false
      }
    }

  },
  required: ['bonusId', 'currencyDetails', 'quantity']
})

export class CreateFreespinBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const bonusId = this.args.bonusId
    const quantity = this.args.quantity
    try {
      const bonus = await this.context.sequelize.models.freespinBonus.upsert({
        bonusId,
        freespinQuantity: quantity,
        gameIds: this.args.gameIds
      }, { transaction: this.context.sequelizeTransaction })

      return { bonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
