import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { AMOE_STATUS, CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'
import crypto from 'crypto'
import { GetIpLocationService } from '../common/getIpLocation.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    ipAddress: { type: 'string' }
  },
  required: ['userId']
})

export class GeneratePostalCodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const { result: { country } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)
      const settings = await Cache.get(CACHE_KEYS.SETTINGS)
      const postalCode = crypto.randomBytes(4).toString('hex').toUpperCase()

      const pendingAmoEntry = await this.context.sequelize.models.amoEntry.findOne({ where: { status: AMOE_STATUS.PENDING, userId } })
      if (pendingAmoEntry) return this.addError('PendingAmoEntryAlreadyExistErrorType')

      const userWallets = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        include: {
          model: this.context.sequelize.models.currency,
          where: { type: CURRENCY_TYPES.SWEEP_COIN },
          required: true
        }
      })
      if (userWallets?.length) {
        let checkZero = false
        userWallets?.forEach((wallet) => {
          if (wallet.amount > 0 || wallet.vaultAmount > 0) {
            checkZero = true
          }
        })
        if (checkZero) return this.addError('UserBalanceGreaterThanZeroErrorType')
      }

      const amoEntry = await this.context.sequelize.models.amoEntry.create({
        userId,
        postalCode,
        country: country.code
      })

      return {
        message: 'Postal code generated successfully. Please send your entry to the mailing address.',
        postalCode: amoEntry.postalCode,
        mailingAddress: settings.amoEntryAddress
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
