import axios from 'axios'
import { Logger } from '../logger'
import { idComply } from '@src/configs'

export class IDComplyAxios {
  constructor () {
    this.axiosInstance = axios.create({
      baseURL: idComply.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        apiKey: idComply.apiKey
      }
    })
  }

  static async createToken (userId) {
    try {
      const payload = {
        apiKey: idComply.apiKey,
        tokenData: {
          redirectUrl: idComply.redirectUrl,
          endpoint: idComply.idpvEndpoint,
          country: 'US',
          userId
        }
      }

      const idComplyAxios = new IDComplyAxios()
      const response = await idComplyAxios.axiosInstance.post('tokens', payload)

      return response.data.result
    } catch (error) {
      Logger.error(`Error in IDComply Create Token - ${error}`)
      return error.response.data
    }
  }

  static async profileDataVerification (userData, customFields = {}) {
    try {
      const payload = {
        apiKey: idComply.apiKey,
        userFields: userData,
        customFields
      }
      const endpoint = idComply.dvEndpoint
      const idComplyAxios = new IDComplyAxios()
      const response = await idComplyAxios.axiosInstance.post(endpoint, payload)

      return response.data.result
    } catch (error) {
      Logger.error(`Error in IDComply Profile Data Verification - ${error}`)
      return error.response.data
    }
  }

  static async checkKycStatus (token) {
    try {
      const idComplyAxios = new IDComplyAxios()
      const response = await idComplyAxios.axiosInstance.get(`token/${token}/status`)
      return response.data.result
    } catch (error) {
      Logger.error(`Error in check Kyc Status - ${error}`)
    }
  }
}
