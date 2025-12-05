import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    depositAllowed: { type: ['string', 'null'], enum: ['true', 'null', ''] },
    withdrawAllowed: { type: ['string', 'null'], enum: ['true', 'null', ''] }
  }
})

export class GetPaymentProvidersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { depositAllowed, withdrawAllowed } = this.args
    try {
      const where = {}
      if (depositAllowed && JSON.parse(depositAllowed)) where.depositAllowed = depositAllowed
      if (withdrawAllowed && JSON.parse(withdrawAllowed)) where.withdrawAllowed = withdrawAllowed

      const paymentProviders = await this.context.sequelize.models.paymentProvider.findAll({ where })

      if (!paymentProviders) return this.addError('PaymentProviderNotExistErrorType')

      return { paymentProviders }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
