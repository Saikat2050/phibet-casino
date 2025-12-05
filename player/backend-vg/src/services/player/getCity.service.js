import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getAll } from '../../utils/crud'
import { Op } from 'sequelize'

export class GetCityService extends ServiceBase {
  async run () {
    const {
      City: CityModel
    } = this.context.dbModels
    const {
      search = '', stateId = ''
    } = this.args
    let data = {}
    if (stateId !== '') {
      data = { stateId }
    }
    if (search !== '') {
      data = { ...data, name: { [Op.iLike]: `%${search}%` } }
    }
    const city = await getAll({
      attributes: ['name', 'city_id'],
      model: CityModel,
      data: data
    })

    return { success: true, data: city, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
