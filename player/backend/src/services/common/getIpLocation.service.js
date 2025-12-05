import { APIError } from '@src/errors/api.error'
import { getGeoLocation } from '@src/libs/geoLocation'
import ServiceBase from '@src/libs/serviceBase'
import stateCodeUsa from '../../database/models/stateCodeUsa.json'
import { Cache } from '@src/libs/cache'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { Logger } from '@src/libs/logger'

export class GetIpLocationService extends ServiceBase {
  async run () {
    try {
      const { countryCode, region } = await getGeoLocation(this.args.ipAddress)
      Logger.info(`-------------------------REGION-------------------------- ${region}`)
      const ipAddressData = {}

      const countries = await Cache.get(CACHE_KEYS.COUNTRIES)
      if (!countries || !countries?.length) {
        const country = await this.context.sequelize.models.country.findOne({ where: { code: countryCode } })
        ipAddressData.country = country
      } else ipAddressData.country = countries.find((list) => list.code === countryCode)

      if (!ipAddressData?.country) return this.addError('YourCountryIsNotListedErrorType')

      if (region && stateCodeUsa[region]) {
        const stateList = await Cache.get(CACHE_KEYS.STATES)
        if (!stateList || !stateList?.length) {
          const state = await this.context.sequelize.models.state.findOne({ where: { code: region, isActive: true } })
          ipAddressData.state = state
        } else ipAddressData.state = stateList.find((list) => list.code === region)
      } else {
        ipAddressData.state = { code: region }
      }

      return ipAddressData
    } catch (error) {
      throw new APIError(error)
    }
  }
}
