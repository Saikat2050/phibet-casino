import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    language: { type: 'string' },
    userId: { type: 'string' },
    visibleInPromotions: { type: 'string' },
    bonusType: { enum: Object.values(BONUS_TYPES) },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 },
    userStatus: { type: 'string' }
  }
})

export class GetAllBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, bonusType, search, perPage, visibleInPromotions, userId, userStatus } = this.args
    // const where = { isActive: true, [Op.or]: [{ validTo: { [Op.gte]: dayjs() } }, { bonusType: BONUS_TYPES.WELCOME }] }
    const where = { isActive: true }

    let include = []
    try {
      if (bonusType) where.bonusType = bonusType
      if (search) where.promotionTitle = { EN: { [Op.iLike]: `%${search}%` } }
      if (visibleInPromotions) where.visibleInPromotions = visibleInPromotions
      if (userId) {
        //
        // const userTags = await this.context.sequelize.models.userTag.findAll({
        //   where: { userId },
        //   attributes: [],
        //   include: {
        //     model: this.context.sequelize.models.tag,
        //     where: { isActive: true },
        //     attributes: ['id'],
        //     required: true
        //   }
        // })
        // const userTagIds = userTags.map(userTag => userTag.tag.id)
        // if (userTagIds) where.tagIds = { [Op.overlap]: userTagIds }

        include = [
          {
            model: this.context.sequelize.models.userBonus,
            attributes: ['status'],
            where: { userId, ...(userStatus && { status: userStatus }) },
            required: !!userStatus
          }
        ]
      }
      const bonus = await this.context.sequelize.models.bonus.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        include
      })

      if (userId) {
        const user = await this.context.sequelize.models.user.findOne({
          where: { id: userId },
          attributes: ['dateOfBirth']
        })

        for (const data of bonus.rows || []) {
          data.dataValues.userStatus = data?.userBonus[0]?.status || null
          
          // Add isClaimable logic for specific bonus types
          if (data.bonusType === BONUS_TYPES.BIRTHDAY) {
            data.dataValues.isClaimable = await this.checkBirthdayBonusClaimable(userId, data, user)
          } else if (data.bonusType === BONUS_TYPES.WELCOME) {
            data.dataValues.isClaimable = await this.checkWelcomeBonusClaimable(userId)
          } else {
            data.dataValues.isClaimable = null
          }
        }
      }

      return { bonus: bonus.rows, page, totalPages: Math.ceil(bonus.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }

  async checkBirthdayBonusClaimable(userId, bonus, user) {
    try {
      // Check if user has dateOfBirth
      if (!user || !user.dateOfBirth) {
        return false
      }

      const today = new Date()
      const dob = new Date(user.dateOfBirth)
      const daysToClear = bonus.daysToClear || 0

      // Calculate this year's birthday
      const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())

      // Calculate days difference between today and birthday
      const daysDifference = Math.abs((today - thisYearBirthday) / (1000 * 60 * 60 * 24))

      // Check if we're within the claimable window
      if (daysDifference > daysToClear) {
        return false
      }

      // Check if already claimed this year
      const claimedBonus = await this.context.sequelize.models.userBonus.findOne({
        where: {
          bonusId: bonus.id,
          userId: userId,
          claimedAt: {
            [Op.gte]: new Date(today.getFullYear(), 0, 1) // Start of current year
          }
        }
      })

      if (claimedBonus) {
        return false
      }

      // Check if already claimed via ledger within the birthday window
      const windowStart = new Date(thisYearBirthday)
      windowStart.setDate(thisYearBirthday.getDate() - daysToClear)
      const windowEnd = new Date(thisYearBirthday)
      windowEnd.setDate(thisYearBirthday.getDate() + daysToClear)

      const ledgerClaim = await this.context.sequelize.models.ledger.findOne({
        where: { purpose: LEDGER_PURPOSE.BIRTHDAY_BONUS },
        include: {
          model: this.context.models.transaction,
          as: 'transactionLedger',
          where: {
            userId: userId,
            createdAt: {
              [Op.between]: [windowStart, windowEnd]
            }
          },
          required: true
        }
      })

      return !ledgerClaim
    } catch (error) {
      return false
    }
  }

  async checkWelcomeBonusClaimable(userId) {
    try {
      // Check if welcome bonus was already claimed via ledger
      const isWelcomeBonusClaimed = await this.context.sequelize.models.ledger.findOne({
        where: { purpose: LEDGER_PURPOSE.WELCOME_BONUS },
        include: {
          model: this.context.models.transaction,
          as: 'transactionLedger',
          where: { userId: userId },
          required: true
        }
      })

      return !isWelcomeBonusClaimed
    } catch (error) {
      return false
    }
  }
}
