import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { QueueWorkerAxios } from '@src/libs/axios/queueWorker.axios'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    aggregatorId: { type: 'string' },
    aggregatorName: { type: 'string', default: 'alea' }
  },
  required: ['aggregatorName']
})

export class LoadAllCasinoDataService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const aggregatorName = this.args.aggregatorName

      if (aggregatorName === 'alea') {
        await QueueWorkerAxios.addAleaGameSeedingJobs()
      } else if (aggregatorName === 'iconic21') {
        await QueueWorkerAxios.addIconic21GameSeedingJobs()
      }
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
