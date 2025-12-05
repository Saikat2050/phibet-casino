import { Cache } from '@src/libs/cache'
import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { PAYMENT_AGGREGATOR } from '@src/utils/constants/payment.constants'

export class GetPaymentAggregatorService extends ServiceBase {
  async run () {
    try {
      let settings

      settings = await Cache.get(CACHE_KEYS.PAYMENT_AGGREGATORS)
      if (!settings?.length) {
        await Cache.set(CACHE_KEYS.PAYMENT_AGGREGATORS, JSON.stringify(Object.values(PAYMENT_AGGREGATOR)))
        settings = Object.values(PAYMENT_AGGREGATOR)
      } else settings = JSON.parse(settings)

      return { aggregators: settings }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
