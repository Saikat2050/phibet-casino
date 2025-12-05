import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { AGGREGATORS } from '@src/utils/constants/casinoManagement.constants'
import { AleaGameLaunchService } from './providers/alea/aleaGameLaunchUrl.service'
import { CURRENCY_TYPES, KYC_STATUS } from '@src/utils/constants/public.constants.utils'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { Cache } from '@src/libs/cache'
import { Iconic21GameLaunchService } from './providers/iconic21/iconic21GameLaunchUrl.service'
import { Op, literal } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    ipAddress: { type: 'string' },
    userId: { type: 'string' },
    demo: { type: 'string' },
    tournamentId: { type: 'number' },
    stateCode: { type: ['string', 'null'] },
    deviceType: { type: 'string', enum: ['Desktop', 'Mobile', null, ''] }
  },
  required: ['gameId', 'demo', 'ipAddress']
})

const AGGREGATOR_IDENTIFIERS_SERVICE_MAP = {
  [AGGREGATORS.ALEA.id]: AleaGameLaunchService,
  [AGGREGATORS.ICONIC21.uniqueId]: Iconic21GameLaunchService
}

export class InitGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const stateCode = this.args.stateCode
    const ipAddress = this.args.ipAddress
    const gameId = this.args.gameId
    const userId = this.args.userId
    const demo = this.args.demo
    const tournamentId = this.args.tournamentId
    const deviceType = this.args.deviceType
    let stateId

    try {
      const { result: { country, state } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)
      if (stateCode) {
        const state = await this.context.sequelize.models.state.findOne({ where: { code: stateCode, isActive: true }, attributes: ['id'], raw: true })
        stateId = state?.id
      }

      const user = await this.context.sequelize.models.user.findOne({ where: { id: userId }, attributes: ['id', 'uniqueId','isActive', 'kycStatus'] })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!user.isActive) return this.addError('UserInactiveErrorType')

      const settings = await Cache.get(CACHE_KEYS.SETTINGS)
      if (settings?.gamePlayeKycRequired && typeof settings.gamePlayeKycRequired === 'string') {
        if (JSON.parse(settings?.gamePlayeKycRequired) && (user.kycStatus !== KYC_STATUS.COMPLETED)) return this.addError('KycRequiredErrorType', 'You need to complete KYC for enabling game play')
      } else if (settings?.gamePlayeKycRequired && (user.kycStatus !== KYC_STATUS.COMPLETED)) return this.addError('KycRequiredErrorType', 'You need to complete KYC for enabling game play')

      const wallet = await this.context.sequelize.models.wallet.findOne({
        attributes: ['id'],
        where: { userId, isDefault: true },
        include: {
          attributes: ['id', 'code', 'type'],
          model: this.context.sequelize.models.currency
        }
      })

      if (!wallet) return this.addError('InvalidWalletIdErrorType')
      const game = await this.context.sequelize.models.casinoGame.findOne({
        where: {
          uniqueId: gameId,
          isActive: true,
          [Op.not]: literal(`
                      NOT EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text("casinoGame"."restricted_states") AS value
                        WHERE value::int = ${stateId || state?.id || 0}
                      )
                    `)
        },
        attributes: ['id', 'uniqueId'],
        include: {
          model: this.context.sequelize.models.casinoProvider,
          where: {
            isActive: true,
            [Op.not]: literal(`
                      NOT EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text("casinoProvider"."restricted_states") AS value
                        WHERE value::int = ${stateId || state?.id || 0}
                      )
                    `)
          },
          required: true,
          include: {
            attributes: ['id', 'uniqueId'],
            model: this.context.sequelize.models.casinoAggregator,
            where: { isActive: true },
            required: true
          }
        }
      })
      if (!AGGREGATOR_IDENTIFIERS_SERVICE_MAP[game?.casinoProvider?.casinoAggregator?.uniqueId]) return this.addError('InvalidAggregatorType')

      const [gameLaunchResult] = await Promise.all([
        AGGREGATOR_IDENTIFIERS_SERVICE_MAP[game?.casinoProvider?.casinoAggregator?.uniqueId].execute({
          ipAddress,
          isDemo: JSON.parse(demo),
          userId,
          game,
          isMobile: !!((deviceType && deviceType === 'Mobile')),
          coinType: wallet.currency?.type || CURRENCY_TYPES.SWEEP_COIN,
          countryCode: country.code,
          tournamentId,
          user
        }, this.context)
        // ActiveBonusValidatorService.execute({ gameId, userId, currencyId: wallet.currency.id }, this.context)
      ])

      return { launchGameUrl: gameLaunchResult.result, provider: game?.casinoProvider }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
