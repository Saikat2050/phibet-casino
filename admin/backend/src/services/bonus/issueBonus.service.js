import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import dayjs from 'dayjs'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    bonusId: { type: 'string' },
    currencyId: { type: 'string' },
    adminUserId: { type: 'string' }
  },
  required: ['userId', 'bonusId', 'adminUserId', 'currencyId']
})

export class IssueBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const bonusId = this.args.bonusId
    const adminUserId = this.args.adminUserId
    const currencyId = this.args.currencyId
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await sequelize.models.user.findOne({
        where: { id: userId },
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const bonus = await this.context.models.bonus.findOne({
        where: { id: bonusId, isActive: true, bonusType: { [Op.ne]: BONUS_TYPES.WELCOME } },
        include: [{
          model: this.context.models.userBonus,
          where: { userId },
          required: false
        },
        {
          attributes: ['id','currencyId'],
          model: this.context.sequelize.models.bonusCurrency,
          where: { currencyId }
        }],
        transaction,
        logging: false
      })

      if (!bonus) return this.addError('BonusDoesNotExistsErrorType')
//         console.log("enteringdata into userbonus",bonus)
// console.log("enteringdata into userbonus1",bonus.bonusCurrencies[0])
// console.log("enteringdata into userbonus2",bonus.bonusCurrencies[0].currencyId)
      if (bonus.userBonus.length) return this.addError('UserBonusAlreadyExistErrorType')



      const userBonus = await this.context.models.userBonus.create({
        bonusId,
        userId: userId,
        issuerId: adminUserId,
        currencyId: bonus.bonusCurrencies[0].currencyId,
        status: USER_BONUS_STATUS_VALUES.PENDING,
        expireAt: dayjs().add(bonus.daysToClear, 'day')
      }, { transaction })

      await bonus.set({ claimedCount: bonus.claimedCount + 1 }).save({ transaction })

      return { userBonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
