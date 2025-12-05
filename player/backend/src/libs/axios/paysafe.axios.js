import { paysafePaymentGateWay } from '@src/configs'
import { messages } from '@src/utils/constants/error.constants'
import axios from 'axios' // Import axios instead of Axios
import { Logger } from '../logger'

export class PaysafeAxios {
  constructor () {
    this.axiosInstance = axios.create({
      baseURL: `${paysafePaymentGateWay.baseUrl}`,
      headers: {
        'Content-Type': 'application/json',
        Simulator: 'EXTERNAL',
        'Live-Mode': false,
        Authorization: `Basic ${Buffer.from(
          `${paysafePaymentGateWay.username}:${paysafePaymentGateWay.password}`
         ).toString('base64')}`
      }
    })
  }

  static async createCustomer ({ body }) {
    try {
      const paysafeAxios = new PaysafeAxios()
      const response = await paysafeAxios.axiosInstance.post('/customers', body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in creating paysafe customer - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async createCustomerToken ({ body, id }) {
    try {
      const paysafeAxios = new PaysafeAxios()
      const response = await paysafeAxios.axiosInstance.post(`/customers/${id}/singleusecustomertokens`, body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in creating paysafe customer token - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async createPayment ({ body }) {
    try {
      const paysafeAxios = new PaysafeAxios()
      const response = await paysafeAxios.axiosInstance.post('/payments', body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in creating paysafe payment - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async processWithdrawPayment ({ body }) {
    try {
      const paysafeAxios = new PaysafeAxios()
      const response = await paysafeAxios.axiosInstance.post('/standalonecredits', body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in creating paysafe withdrawal - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async createPaymentHandle ({ body }) {
    try {
      const paysafeAxios = new PaysafeAxios()
      const response = await paysafeAxios.axiosInstance.post('/paymenthandles', body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in creating paysafe payment handle - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }

  static async createCustomerVerification ({ body }) {
    try {
      const paysafeAxios = new PaysafeAxios()
      const response = await paysafeAxios.axiosInstance.post('/verifications', body)
      if (response.status === 200 || response.status === 201) return response.data
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      Logger.error(`Error in creating paysafe customer verification - ${error}`)
      throw messages.SERVICE_UNAVAILABLE
    }
  }
}
