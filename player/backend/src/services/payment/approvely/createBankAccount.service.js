
import { APIError } from '@src/errors/api.error'
import { ApprovelyAxios } from '@src/libs/axios/approvely.axios'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    alias: { type: 'string' },
    routingNumber: { type: 'string' },
    accountNumber: { type: 'string' },
    type: { enum: ['checking', 'savings'], default: 'checking' }
  },
  required: ['userId', 'alias', 'routingNumber', 'accountNumber']
})

export class ApprovelyCreateBankService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, alias, routingNumber, accountNumber, type } = this.args

    try {
      const user = await this.context.sequelize.models.user.findOne({ attributes: ['uniqueId'], where: { id: userId }, raw: true })
      const body = {
        alias,
        routingNumber,
        accountNumber,
        type
      }

      const result = await ApprovelyAxios.createBank(user?.uniqueId, body)
      return { bankAccounts: result?.withdrawer?.bankAccounts ?? [], cards: result?.withdrawer?.cards ?? [] }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
