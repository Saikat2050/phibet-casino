
import { APIError } from '@src/errors/api.error'
import { ApprovelyAxios } from '@src/libs/axios/approvely.axios'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    expYear: { type: 'string', pattern: '^\\d{2}$' },
    expMonth: { type: 'string', pattern: '^\\d{2}$' },
    cardToken: { type: 'string' }
  },
  required: ['userId', 'expYear', 'expMonth', 'cardToken']
})

export class ApprovelyCreateDebitCardService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, expYear, expMonth, cardToken } = this.args

    try {
      const user = await this.context.sequelize.models.user.findOne({ attributes: ['uniqueId'], where: { id: userId }, raw: true })
      const userAddress = await this.context.sequelize.models.address.findOne({ attributes: ['address1', 'address2', 'city', 'stateCode', 'zipCode', 'countryCode'], where: { userId }, raw: true })
      const body = {
        expYear,
        expMonth,
        cardToken: cardToken.trim(),
        address: {
          address1: [userAddress?.address1, userAddress?.address2].filter(Boolean).join(' ').trim(),
          city: userAddress?.city,
          state: userAddress?.stateCode ?? '',
          zip: userAddress?.zipCode
        }
      }

      const result = await ApprovelyAxios.createDebitCard(user?.uniqueId, body)
      return { bankAccounts: result?.withdrawer?.bankAccounts ?? [], cards: result?.withdrawer?.cards ?? [] }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
