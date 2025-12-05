import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES, WAGERING_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import dayjs from 'dayjs'
import { Op } from 'sequelize'
import { CreateTransactionService } from '../transaction/createTransaction.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    bonusId: { type: 'string' },
    currencyId: { type: 'string' },
    userId: { type: 'string' }
  },
  required: ['bonusId', 'userId', 'currencyId']
})

export class AvailBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const bonusId = this.args.bonusId
    const currencyId = this.args.currencyId
    const transaction = this.context.sequelizeTransaction

    try {
      if (await this.context.sequelize.models.userBonus.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { userId, currencyId,bonusId, status: { [Op.in]: [USER_BONUS_STATUS_VALUES.ACTIVE, USER_BONUS_STATUS_VALUES.IN_PROCESS] } }
      })) return this.addError('BonusAlreadyActiveErrorType')

      const bonus = await this.context.sequelize.models.bonus.findOne({
        attributes: { exclude: ['createAt', 'updatedAt'] },
        where: { id: bonusId, bonusType: { [Op.ne]: BONUS_TYPES.WELCOME } },
        include: [{
          model: this.context.sequelize.models.userBonus,
          where: { userId },
          required: false
        }
        // ,
        // {
        //   attributes: { exclude: ['createdAt', 'updatedAt'] },
        //   model: this.context.sequelize.models.freespinBonus,
        //   as: 'freespinBonus',
        //   required: false
        // }
      ],
        transaction
      })

      if (!bonus) return this.addError('InvalidBonusErrorType')
      if (bonus.tagIds) {
        const userTags = await this.context.sequelize.models.userTag.findAll({
          where: { tagId: { [Op.in]: bonus.tagIds }, userId }
        })
        if (userTags.length === 0) return this.addError('InvalidTagErrorType')
      }
      const [userBonus] = await this.context.models.userBonus.upsert({
        bonusId,
        userId: userId,
        currencyId,
        status: bonus.bonusType === BONUS_TYPES.DEPOSIT ? USER_BONUS_STATUS_VALUES.IN_PROCESS : USER_BONUS_STATUS_VALUES.ACTIVE,
        expireAt: dayjs().add(bonus.daysToClear, 'day'),
        claimedAt: dayjs()
      }, { transaction })

      const wallet = await this.context.sequelize.models.wallet.findOne({ where: { userId, currencyId } })

      if (wallet.bonusAmount > 0) {
        await CreateTransactionService.execute({
          userId,
          amount: wallet.bonusAmount,
          wallet,
          currencyId,
          purpose: LEDGER_PURPOSE.WELCOME_BONUS,
          amountType: WAGERING_TYPES.BONUS
        }, this.context)
      }

      // if (bonus.bonusType === BONUS_TYPES.FREESPINS) {
      //   bonus.meta = await this.context.sequelize.models.userBonusFreespinBonusMeta.create({
      //     remainingFreespins: bonus.freespinBonus.quantity,
      //     userBonusId: userBonus.id,
      //     allowedGames: bonus.freespinBonus.gameIds
      //   }, { transaction })
      //   // Send callback to casino about freespins here
      // }

      if (userBonus) await bonus.set({ claimedCount: bonus.claimedCount + 1 }).save({ transaction })

      return { userBonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
