import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils'

const TAB_OPTIONS = {
  GAME: 'game',
  PROVIDER: 'provider'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    id: { type: 'string' },
    currencyId: { type: 'string' },
    tab: { enum: Object.values(TAB_OPTIONS), default: TAB_OPTIONS.GAME },
    tagIds: { type: 'string' }
  },
  required: ['tab', 'id']
})

export class GetGameReportPlayerCountService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { tab, currencyId, id, fromDate, toDate, tagIds } = this.args

      let isInternal = false
      if (tagIds) {
        const [[result]] = await this.context.sequelize.query(
          'SELECT 1 FROM public.tags WHERE tag = \'INTERNAL\' AND id = :tagIds',
          { replacements: { tagIds } }
        )

        isInternal = !!result
      }
      const query = `
        SELECT COUNT(DISTINCT casinoTransaction.user_id) AS distinctPlayerCount
          FROM public.casino_transactions AS casinoTransaction
        INNER JOIN public.ledgers AS ledger
          ON casinoTransaction.id = ledger.transaction_id
        INNER JOIN public.casino_games AS casinoGame
          ON casinoTransaction.game_id = casinoGame.id
        ${tab === TAB_OPTIONS.PROVIDER
          ? `
          INNER JOIN public.casino_providers AS casinoProvider
          ON casinoGame.casino_provider_id = casinoProvider.id
        `
        : ''}
        WHERE casinoTransaction.created_at >= TIMESTAMP '${fromDate}'
          AND casinoTransaction.created_at < TIMESTAMP '${toDate}'
          ${currencyId ? `AND ledger.currency_id = ${currencyId}` : ''}
          AND ledger.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
        ${tab === TAB_OPTIONS.PROVIDER
          ? `AND casinoProvider.id = ${id}`
          : `AND casinoGame.id = ${id}`}
        ${isInternal
          ? `AND EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = casinoTransaction.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= casinoTransaction.created_at
          )`
          : `AND NOT EXISTS (
          SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = casinoTransaction.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= casinoTransaction.created_at
        )`}
      `
      const [data] = await this.context.sequelize.query(query, { logging: false })
      return data[0] || 0
    } catch (error) {
      throw new APIError(error)
    }
  }
}
