import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'

export class GetAllBannersService extends ServiceBase {
  async run () {
    try {
      const banners = await this.context.sequelize.models.banner.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: this.context.sequelize.models.bannerItem,
          as: 'items',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          order: [['order', 'ASC'], ['id', 'ASC']]
        }],
        order: [['id', 'ASC']]
      })
      // Always convert to plain objects for correct JSON output
      return { banners: banners.map(b => b.get({ plain: true })) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
