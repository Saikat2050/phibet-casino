import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetStatesService extends ServiceBase {
  async run () {
    try {
      let states = await Cache.get(CACHE_KEYS.STATES)

      if (!states || (states && !Object.keys(states)?.length)) {
        states = await sequelize.models.state.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
        await Cache.set(CACHE_KEYS.STATES, states)
      }

      return states
    } catch (error) {
      throw new APIError(error)
    }
  }
}
