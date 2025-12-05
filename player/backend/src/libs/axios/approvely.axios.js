import { approvelyPaymentGateWay } from '@src/configs/payment/approvely.config'
import { messages } from '@src/utils/constants/error.constants'
import axios from 'axios'
import { Logger } from '../logger'
import { appConfig } from '@src/configs'

export class ApprovelyAxios {
  constructor (userId) {
    this.axiosInstance = axios.create({
      baseURL: `${approvelyPaymentGateWay.url}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${approvelyPaymentGateWay.privateApiKey}`,
        'x-coinflow-auth-user-id': userId // Dynamic header
      }
    })
  }

  static async sendRequest (userId, body) {
    try {
      const approvelyAxios = new ApprovelyAxios(userId)
      const response = await approvelyAxios.axiosInstance.post('/api/checkout/link', body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in Approvely request - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async getWithdrawer (userId) {
    try {
      const approvelyAxios = new ApprovelyAxios(userId)
      const response = await approvelyAxios.axiosInstance.get('/api/withdraw', {
        params: { redirectLink: `${appConfig.app.userFeUrl}?modal=redeem` }
      })

      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      if (error?.response?.status === 451) return error?.response?.data
      Logger.error(`Error in Approvely get withdrawal request - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async registerUser (userId, body) {
    try {
      const approvelyAxios = new ApprovelyAxios(userId)
      const response = await approvelyAxios.axiosInstance.post('/api/withdraw/kyc', body)

      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      if (error?.response?.status === 451) return error?.response?.data
      Logger.error(`Error in Approvely register user request - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async createBank (userId, body) {
    try {
      const approvelyAxios = new ApprovelyAxios(userId)
      const response = await approvelyAxios.axiosInstance.post('/api/withdraw/account', body)

      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      console.log('----------------------------------CREATE BANK-------------', error)
      Logger.error(`Error in Approvely create bank request - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async createDebitCard (userId, body) {
    try {
      const approvelyAxios = new ApprovelyAxios(userId)
      const response = await approvelyAxios.axiosInstance.post('/api/withdraw/debit-card', body)

      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in Approvely create debit card request - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }
}
