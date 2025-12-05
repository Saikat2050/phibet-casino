import { Op } from 'sequelize'
import { Cache } from '@src/libs/cache'
import { dayjs } from '@src/libs/dayjs'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetWelcomePackageService extends ServiceBase {
  async run () {
    try {
      let welcomePackage = await Cache.get(CACHE_KEYS.WELCOME_PACKAGE)
      if (!welcomePackage || (welcomePackage && !Object.keys(welcomePackage)?.length)) {
        welcomePackage = await this.context.sequelize.models.package.findOne({
          where: {
            welcomePackage: true,
            isActive: true,
            validFrom: { [Op.lte]: dayjs().format() },
            validTill: { [Op.gte]: dayjs().format() }
          }
        })

        await Cache.set(CACHE_KEYS.WELCOME_PACKAGE, welcomePackage)
      } else if (welcomePackage && !welcomePackage.isActive) welcomePackage = null

      return { welcomePackage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
