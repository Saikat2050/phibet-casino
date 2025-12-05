import { appConfig } from '@src/configs'
import { Axios } from 'axios'
import { Logger } from '../logger'

export class QueueWorkerAxios extends Axios {
  constructor () {
    super({
      baseURL: `${appConfig.queueWorker.endpoint}/api/v1/internal`,
      auth: {
        username: appConfig.queueWorker.basicAuth.username,
        password: appConfig.queueWorker.basicAuth.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Schedules jobs for a tournament.
   * @param {string} tournamentId - The ID of the tournament.
   * @param {string} registrationEndDate - The end date of the registration period.
   * @param {string} endDate - The end date of the tournament.
   * @returns {Promise<boolean>} - Returns true if the job is scheduled successfully.
   * @throws {Error} - Throws an error if the service is unavailable.
   */
  static async scheduleJobs (tournamentId, registrationEndDate, endDate) {
    try {
      const queueWorkerAxios = new QueueWorkerAxios()
      const response = await queueWorkerAxios.post('/tournament/add-jobs', JSON.stringify({
        tournamentId, registrationEndDate, endDate
      }))
      if (response.status !== 200) throw response.data.errors
      return true
    } catch (error) {
      throw Error('ServiceUnavailableErrorType')
    }
  }

  /**
   * Schedule pay by bank withdrawal request job
   */
  static async scheduleWithdrawalRequestJob (withdrawalRequestId) {
    try {
      const queueWorkerAxios = new QueueWorkerAxios()
      const response = await queueWorkerAxios.post('/withdrawal/pay-by-bank', JSON.stringify({ withdrawalRequestId }))
      if (response.status !== 200) throw response.data.errors
      return true
    } catch (error) {
      Logger.error(`Somerthing went wrong for withdrawal queue - ${error}`)
      throw Error('ServiceUnavailableErrorType')
    }
  }

  static async addIconic21GameSeedingJobs () {
    try {
      const queueWorkerAxios = new QueueWorkerAxios()
      const response = await queueWorkerAxios.post('games/iconic21')
      if (response.status !== 200) throw response.data.errors
      return true
    } catch (error) {
      Logger.error(`Something went wrong for iconic21 game seeding queue - ${error}`)
      throw Error('ServiceUnavailableErrorType')
    }
  }

  static async addAleaGameSeedingJobs () {
    try {
      const queueWorkerAxios = new QueueWorkerAxios()
      const response = await queueWorkerAxios.post('games/alea')
      if (response.status !== 200) throw response.data.errors
      return true
    } catch (error) {
      Logger.error(`Something went wrong for alea game seeding queue - ${error}`)
      throw Error('ServiceUnavailableErrorType')
    }
  }
}
