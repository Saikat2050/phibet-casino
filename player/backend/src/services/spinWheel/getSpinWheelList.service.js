import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'

export class GetSpinWheelListService extends ServiceBase {
  async run () {
    try {
      const wheelConfiguration = await this.context.sequelize.models.wheelDivisionConfiguration.findAll({ attributes: ['sc', 'gc'], order: [['wheelDivisionId', 'ASC']] })
      return { wheelConfiguration }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
