import { sequelize } from '@src/database'
import { Cache } from '@src/helpers/redis.helpers'
import { dayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'

export class ExpireBonusService extends ServiceBase {
  async run () {
    try {
      const transaction = await sequelize.transaction()

      await sequelize.models.package.update({ isActive: false }, {
        where: {
          [Op.or]: [
            {
              validTill: { [Op.lte]: new Date() },
              isActive: true
            }
          ]
        },
        transaction
      })

      const welcomePackage = await sequelize.models.package.findOne({
        where: {
          welcomePackage: true,
          isActive: true,
          validFrom: { [Op.lte]: dayjs().format() },
          validTill: { [Op.gte]: dayjs().format() }
        },
        transaction
      })

      await Cache.set(CACHE_KEYS.WELCOME_PACKAGE, welcomePackage)

      await transaction.commit()
      return { success: true }
    } catch (error) {
      return { success: false, message: 'Error in Expire Bonus Service', data: null, error }
    }
  }
}
