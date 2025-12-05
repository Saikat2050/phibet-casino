import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { GetWelcomePackageService } from '@src/services/bonus/getWelcomePackage.service'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { GetJoiningBonusService } from '../bonus/getJoiningBonus.service'
import { GetBirthdayBonusService } from '../bonus/getBirthdayBonus.service'
const moment = require('moment-timezone')

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GetUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: this.args.userId },
        include: [
          {
            model: this.context.sequelize.models.wallet,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
              {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                model: this.context.sequelize.models.currency,
                where: { isActive: true },
                required: true
              }
            ]
          },
          {
            model: this.context.sequelize.models.address,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          },
          {
            model: this.context.sequelize.models.userBonus,
            attributes: ['id', 'userId', ['created_at', 'last_spin_date']],
            where: { moreDetails: { [Op.contains]: { type: 'spinWheel' } } },
            order: [['createdAt', 'DESC']],
            limit: 1,
            required: false
          }
        ],
        attributes: { exclude: ['phoneOtp', 'password'] }
      })

      const getWelcomePackage = await GetWelcomePackageService.execute({}, this.context)
      if (getWelcomePackage?.result?.welcomePackage) {
        const time = moment(user.createdAt).add(getWelcomePackage?.result?.welcomePackage?.timer, 'hours').format()
        if (moment().format() > time) getWelcomePackage.result = { welcomePackage: null }
      }

      user.phoneCode = (user.phoneCode) ? user.phoneCode.replace('+', '') : ''
      const welcomeBonus = await GetJoiningBonusService.execute({ userId: user.id }, this.context)
      const birthdayBonus = await GetBirthdayBonusService.execute({ userId: user.id }, this.context)
      const amoeBonus = await this.context.sequelize.models.bonus.findOne({
        where: {
          bonusType: BONUS_TYPES.AMOE_CODE,
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

      return {
        user,
        referralCode: `REF${btoa(user.id)}`,
        getWelcomePackage: getWelcomePackage?.result || null,
        welcomeBonus: welcomeBonus?.result,
        birthdayBonus: birthdayBonus?.result,
        amoeBonus
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
