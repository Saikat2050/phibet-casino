import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    bonusType: { enum: Object.values(BONUS_TYPES) }
  },
  required: ['bonusId', 'bonusType']
})

export class GetBonusDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  /**
   *
   * @param {string} bonusType
   * @returns {object}
   */
  buildIncludeForBonusType (bonusType) {
    const include = {}

    switch (bonusType) {
      case BONUS_TYPES.FREESPINS:
        include.as = 'freespinBonus'
        include.attributes = { exclude: ['createdAt', 'updatedAt'] }
        include.model = this.context.sequelize.models.freespinBonus
        break

      // case BONUS_TYPES.DEPOSIT:
      //   include.model = this.context.sequelize.models.depositBonus
      //   include.as = 'depositBonus'
      //   break

        // Add cases for new bonus types here
        // Example:
        // case BONUS_TYPES.NEW_BONUS_TYPE:
        //   include.model = this.context.sequelize.models.newBonusType
        //   break

      default:
        break
    }
    return include
  }

  async run () {
    const { bonusId, bonusType } = this.args
    let tags = []
    try {
      const options = {
        where: { id: bonusId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          attributes: { exclude: ['crerateAt', 'updatedAt'] },
          model: this.context.sequelize.models.bonusCurrency
        }]
      }
      if (_.size(this.buildIncludeForBonusType(bonusType))) options.include.push(this.buildIncludeForBonusType(bonusType))
      const bonus = await this.context.sequelize.models.bonus.findOne(options)
      if (!bonus) this.addError('BonusDoesNotExistsErrorType')

      if (bonus.tagIds) {
        tags = await this.context.sequelize.models.tag.findAll({
          where: { id: bonus.tagIds }
        })
      }
      return { bonus, tags }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
