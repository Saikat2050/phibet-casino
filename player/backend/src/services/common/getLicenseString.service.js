import { geoComply } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { client } from '@src/libs/redis'
import ServiceBase from '@src/libs/serviceBase'
import axios from 'axios'

const schema = {
  type: 'object',
  properties: {
    isExpired: { type: 'string' }
  },
  required: []
}

const constraints = ajv.compile(schema)
export class GetLicenseString extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isExpired } = this.args

    try {
      let licenseString = await client.get('geocomply-license-string')

      if (!licenseString || isExpired === 'true') {
        const { data } = await axios.get(`${geoComply.licenseAPI}?akey=${geoComply.licenseAPIKey}&skey=${geoComply.licenseSecretKey}&html5=secure`)
        const regex = /expires="([^"]+)"/
        const match = data.match(regex)
        const expiryDate = new Date(match[1])
        const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000)
        licenseString = data
        await client.set('geocomply-license-string', data, 'EX', expiryTimestamp)
      }

      return { success: true, licenseString }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
