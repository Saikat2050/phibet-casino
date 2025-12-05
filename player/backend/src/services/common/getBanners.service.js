import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetBannersService extends ServiceBase {
  async run () {
    try {
      let banners = await Cache.get(CACHE_KEYS.BANNERS)
      if (!banners?.length) {
        banners = await sequelize.models.banner.findAll({
          attributes: ['id', 'type'],
          include: [{
            model: sequelize.models.bannerItem,
            as: 'items',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['order', 'ASC'], ['id', 'ASC']]
          }],
          order: [['id', 'ASC']]
        })
        await Cache.set(CACHE_KEYS.BANNERS, banners)
        return { pages: banners }
      }
      return { banners }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
