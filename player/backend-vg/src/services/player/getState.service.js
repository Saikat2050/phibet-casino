import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getAll, getOne } from '../../utils/crud'
import { Op } from 'sequelize'
import { excludedStates } from '../../configs/states'
export class GetStateService extends ServiceBase {
  async run () {
    const {
      State: StateModel,
      Country: CountryModel
    } = this.context.dbModels
    const {
      countryCode = 'US', search = ''
    } = this.args

    let data = { name: { [Op.notIn]: excludedStates } }
    if (countryCode !== '') {
      const getCountryId = await getOne({
        model: CountryModel,
        data: { code: countryCode }
      })
      data = { ...data, countryId: getCountryId.countryId }
    }
    if (search !== '') {
      data = { ...data, name: { [Op.iLike]: `%${search}%` } }
    }
    const state = await getAll({
      attributes: ['name', 'stateCode', 'state_id', 'is_archived'],
      model: StateModel,
      data: data
    })
    return { success: true, data: state, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
