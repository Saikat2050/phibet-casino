import { messages } from '@src/utils/constants/error.constants'
import axios from 'axios'
import { Logger } from '../logger'
import { shuftiKyc } from '@src/configs/shufti.config'

export class ShuftiAxios {
  constructor () {
    this.axiosInstance = axios.create({
      baseURL: `${shuftiKyc.url}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${shuftiKyc.clientId}:${shuftiKyc.secretKey}`)}`
      }
    })
  }

  static async initializeVerification (body) {
    try {
      const shuftiAxios = new ShuftiAxios()
      const response = await shuftiAxios.axiosInstance.post('/', body)

      return response?.data || {}
    } catch (error) {
      Logger.error(`Error in Shufti Verification request - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }
}
