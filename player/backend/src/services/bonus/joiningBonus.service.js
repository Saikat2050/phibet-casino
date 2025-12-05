import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { Op } from 'sequelize'
import { ProcessJoiningBonusService } from './processJoiningBonus.service'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { Cache } from '@src/libs/cache'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    emailVerified: { type: 'string' }
  },
  required: ['userId', 'email', 'username']
})

export class JoiningBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const transaction = this.context.sequelizeTransaction

      let welcomeBonus = await Cache.get(CACHE_KEYS.JOINING_BONUS)
      if (!welcomeBonus || (welcomeBonus && !Object.keys(welcomeBonus)?.length)) {
        welcomeBonus = await this.context.sequelize.models.bonus.findOne({
          attributes: ['id', 'claimedCount', 'moreDetails'],
          where: {
            bonusType: BONUS_TYPES.JOINING,
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

        await Cache.set(CACHE_KEYS.JOINING_BONUS, welcomeBonus)
      }

      if (!welcomeBonus) {
        return this.addError('InvalidBonusIdErrorType')
      }
      const existingBonus = await this.context.sequelize.models.userBonus.findOne({
        where: { bonusId: welcomeBonus.id, userId },
        transaction
      })

      if (existingBonus) {
        return this.addError('JoiningBonusAlreadyExistErrorType')
      }

      if (welcomeBonus?.moreDetails?.purchaseRequired) {
        const requiredCheckFlag = 'isPurchaseRequired'
        const result = await ProcessJoiningBonusService.execute({ welcomeBonus, userId, requiredCheckFlag }, this.context)
        return result
      } else {
        const requiredCheckFlag = 'isEmailVerified'
        const result = await ProcessJoiningBonusService.execute({ welcomeBonus, userId, requiredCheckFlag }, this.context)
        return result.result
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
