import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

export class GetJoiningBonusService extends ServiceBase {
  async run () {
    try {
      let isJoiningBonusClaimed

      if (this.args.userId) {
        isJoiningBonusClaimed = await this.context.sequelize.models.ledger.findOne({
          where: { purpose: LEDGER_PURPOSE.WELCOME_BONUS },
          include: {
            model: this.context.models.transaction,
            as: 'transactionLedger',
            where: { userId: this.args.userId },
            required: true
          }
        })


      }

      const joiningBonus = await this.context.sequelize.models.bonus.findOne({
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
        }
      })
      if (joiningBonus && !isJoiningBonusClaimed) return joiningBonus
      return {}
    } catch (error) {
      throw new APIError(error)
    }
  }
}
