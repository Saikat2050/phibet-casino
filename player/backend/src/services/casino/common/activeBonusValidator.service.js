import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { dayjs } from '@src/libs/dayjs'
import ServiceBase from '@src/libs/serviceBase'
import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { ACTIVE_BONUS_KEY_SUFFIX } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    currencyId: { type: 'string' }
  },
  required: ['userId', 'gameId', 'currencyId']
})

export class ActiveBonusValidatorService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, currencyId, gameId } = this.args

    try {
      const userBonus = await this.context.sequelize.models.userBonus.findOne({
        attributes: ['id'],
        where: {
          userId,
          status: USER_BONUS_STATUS_VALUES.ACTIVE,
          currencyId,
          expireAt: { [Op.gt]: dayjs() }
        },
        include: [{
          model: this.context.sequelize.models.bonus,
          attributes: ['bonusType', 'id'],
          include: [{
            model: this.context.sequelize.models.wageringTemplate,
            attributes: ['id', 'wageringRequirementType'],
            include: {
              attributes: ['contributionPercentage'],
              model: this.context.sequelize.models.wageringTemplateGameDetail,
              include: {
                attributes: {},
                where: { uniqueId: gameId },
                model: this.context.sequelize.models.casinoGame
              }
            }
          }]
        }]
      })

      if (!userBonus || !userBonus.bonus) return

      const bonus = userBonus.bonus
      const wageringTemplate = bonus.wageringTemplate

      if (!wageringTemplate || !wageringTemplate.wageringTemplateGameDetails.length) {
        return this.addError('NoWageringTemplateError')
      }

      const wageringDetail = wageringTemplate.wageringTemplateGameDetails[0]

      await Cache.set(`${userId}${ACTIVE_BONUS_KEY_SUFFIX}`, JSON.stringify({
        bonusId: bonus.id,
        userBonusId: userBonus.id,
        bonusType: bonus.bonusType,
        currencyId,
        wageringRequirementType: wageringTemplate.wageringRequirementType,
        contributionPercentage: wageringDetail.contributionPercentage || 100
      }))

      return true
    } catch (error) {
      throw new APIError(error)
    }
  }
}
