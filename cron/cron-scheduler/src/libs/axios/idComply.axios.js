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
