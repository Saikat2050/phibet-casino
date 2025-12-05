import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

export class GetRolesService extends ServiceBase {
  async run () {
    try {
      const roles = await this.context.sequelize.models.adminRole.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { name: { [Op.ne]: 'Superadmin' } }
      })
      return { roles }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
