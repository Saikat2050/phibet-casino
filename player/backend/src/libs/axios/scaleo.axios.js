import axios from 'axios'
import { Logger } from '../logger'
import { appConfig } from '@src/configs'

export class ScaleoAxios {
  constructor () {
    this.axiosInstance = axios.create({
      baseURL: `${appConfig.jobScheduler.jobSchedulerUrl}/scaleo`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${appConfig.jobScheduler.jobSchedulerUsername}:${appConfig.jobScheduler.jobSchedulerPassword}`).toString('base64')}`
      }
    })
  }

  static async sendEventData (payload) {
    try {
      const scaleoAxios = new ScaleoAxios()
      const response = await scaleoAxios.axiosInstance.post('', payload)
      console.log(response, 'scaleo send event data response')

      if (response === 'OK') {
        Logger.info('scaleo event emitted successfully')
      } else {
        Logger.error('Error in scaleo event emitter')
      }
    } catch (error) {
      Logger.error(`Error in sending scaleo event data - ${error}`)
      // throw messages.SERVICE_UNAVAILABLE
    }
  }
}
