import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

export class GetBirthdayBonusService extends ServiceBase {
  async run () {
    try {

      let isBirthdayBonusClaimed

      if (this.args.userId) {
        const user = await this.context.sequelize.models.user.findOne({
          where: { id: this.args.userId },
          attributes: ['dateOfBirth']
        })

        if (!user || !user.dateOfBirth) {
          return {}
        }

        const birthdayBonus = await this.context.sequelize.models.bonus.findOne({
          where: {
            bonusType: BONUS_TYPES.BIRTHDAY,
            isActive: true
          },
          attributes: ['id', 'daysToClear']
        })

        if (!birthdayBonus) {
          return {}
        }

        const today = new Date()
        const dob = new Date(user.dateOfBirth)
        const daysToClear = birthdayBonus.daysToClear || 0


        const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())

        const daysDifference = Math.abs((today - thisYearBirthday) / (1000 * 60 * 60 * 24))


        if (daysDifference > daysToClear) {

          return {}
        }

        const claimedBonus = await this.context.sequelize.models.userBonus.findOne({
          where: {
            bonusId: birthdayBonus.id,
            userId: this.args.userId,
            claimedAt: {
              [Op.gte]: new Date(today.setFullYear(today.getFullYear() - 1))
            }
          }
        })

        if (claimedBonus) {
          return {}
        }

        const windowStart = new Date(thisYearBirthday)
        windowStart.setDate(thisYearBirthday.getDate() - daysToClear)
        const windowEnd = new Date(thisYearBirthday)
        windowEnd.setDate(thisYearBirthday.getDate() + daysToClear)

        isBirthdayBonusClaimed = await this.context.sequelize.models.ledger.findOne({
          where: { purpose: LEDGER_PURPOSE.BIRTHDAY_BONUS },
          include: {
            model: this.context.models.transaction,
            as: 'transactionLedger',
            where: {
              userId: this.args.userId,
              createdAt: {
                [Op.between]: [windowStart, windowEnd]
              }
            },
            required: true
          }
        })
      }

      const birthdayBonus = await this.context.sequelize.models.bonus.findOne({
        where: {
          bonusType: BONUS_TYPES.BIRTHDAY,
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



      if (birthdayBonus && !isBirthdayBonusClaimed) {
        return birthdayBonus
      }

      return {}
    } catch (error) {
      throw new APIError(error)
    }
  }
}
