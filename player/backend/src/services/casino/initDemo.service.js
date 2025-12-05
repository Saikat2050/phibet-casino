import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { AGGREGATORS } from '@src/utils/constants/casinoManagement.constants'
import { AleaGameLaunchService } from './providers/alea/aleaGameLaunchUrl.service'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    ipAddress: { type: 'string' },
    userId: { type: 'string' },
    deviceType: { type: 'string', enum: ['Desktop', 'Mobile', null, ''] }
  },
  required: ['gameId', 'ipAddress']
})

const AGGREGATOR_IDENTIFIERS_SERVICE_MAP = {
  [AGGREGATORS.ALEA.id]: AleaGameLaunchService
}

export class InitDemoGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ipAddress = this.args.ipAddress
    const gameId = this.args.gameId
    const tournamentId = this.args.tournamentId
    const deviceType = this.args.deviceType

    try {
      const { result: { country } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)

      const game = await this.context.sequelize.models.casinoGame.findOne({
        where: { uniqueId: gameId, isActive: true, demoAvailable: true },
        include: {
          model: this.context.sequelize.models.casinoProvider,
          where: { isActive: true },
          required: true,
          include: {
            attributes: ['id'],
            model: this.context.sequelize.models.casinoAggregator,
            where: { isActive: true },
            required: true
          }
        }
      })

      if (!AGGREGATOR_IDENTIFIERS_SERVICE_MAP[game?.casinoProvider?.casinoAggregator?.id]) return this.addError('InvalidAggregatorType')

      const [gameLaunchResult] = await Promise.all([
        AGGREGATOR_IDENTIFIERS_SERVICE_MAP[game?.casinoProvider?.casinoAggregator?.id].execute({
          ipAddress,
          isDemo: true,
          game,
          isMobile: !!((deviceType && deviceType === 'Mobile')),
          coinType: CURRENCY_TYPES.GOLD_COIN,
          countryCode: country.code,
          tournamentId
        }, this.context)
        // ActiveBonusValidatorService.execute({ gameId, userId, currencyId: wallet.currency.id }, this.context)
      ])

      return { launchGameUrl: gameLaunchResult.result }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
