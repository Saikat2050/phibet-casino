import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_TRANSACTION_TYPE, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

const TAB_OPTIONS = {
  GAME: 'game',
  PROVIDER: 'provider'
}

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    currencyId: { type: 'string' },
    gameName: { type: 'string' },
    tab: { enum: Object.values(TAB_OPTIONS), default: TAB_OPTIONS.GAME },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 2, maximum: 500, default: 5 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['totalBetAmount', 'totalWinAmount', 'id'], default: 'totalBetAmount' },
    type: { enum: ['dashboard', 'report'], default: 'dashboard' },
    csvDownload: { type: ['string', 'null'] },
    tagIds: { type: 'string' }
  },
  required: ['tab']
})

export class GetGameReportServiceV1 extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { tab, currencyId, page, perPage, order, orderBy, fromDate, toDate, gameName, type, csvDownload, tagIds } = this.args

      let isInternal = false
      if (tagIds) {
        const [[result]] = await this.context.sequelize.query(
          'SELECT 1 FROM public.tags WHERE tag = \'INTERNAL\' AND id = :tagIds',
          { replacements: { tagIds } }
        )

        isInternal = !!result
      }

      const query = `WITH filtered_aggregates AS (
        SELECT
          ${currencyId ? 'currency_id AS "currencyId",' : ''}
          ${tab === TAB_OPTIONS.PROVIDER
          ? 'provider_id AS id, (SELECT name#>>\'{EN}\' FROM public.casino_providers WHERE id = provider_id) AS name'
          : 'game_id AS id, (SELECT name#>>\'{EN}\' FROM public.casino_games WHERE id = game_id) AS name'
        },
          COALESCE(ROUND(SUM(total_bet_amount)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalBetAmount",
          COALESCE(ROUND(SUM(total_win_amount)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalWinAmount",
          COALESCE(ROUND(SUM(total_bet_rollback_amount)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalBetRollbackAmount",
          COALESCE(ROUND(SUM(total_win_rollback_amount)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalWinRollbackAmount"
        FROM game_report_aggregates
        WHERE
          (${tab === TAB_OPTIONS.PROVIDER ? 'provider_id' : 'game_id'}) IS NOT NULL
          AND (from_date, till_date) OVERLAPS(TIMESTAMP '${fromDate}', TIMESTAMP '${toDate}')
          ${currencyId ? `AND currency_id = ${currencyId}` : 'AND currency_id != 1'}
          AND is_internal = ${isInternal}
        GROUP BY
        ${tab === TAB_OPTIONS.PROVIDER ? 'provider_id' : 'game_id'}
        ${currencyId ? ', currency_id' : ''}
      ),
      filtered_transactions AS (
        SELECT
          ${currencyId ? 'ledger.currency_id AS "currencyId",' : ''}
          ${tab === TAB_OPTIONS.PROVIDER
          ? 'casinoGame.casino_provider_id AS id, (SELECT name#>>\'{EN}\' FROM public.casino_providers WHERE id = casinoGame.casino_provider_id) AS name'
          : 'casinoTransaction.game_id AS id, (SELECT name#>>\'{EN}\' FROM public.casino_games WHERE id = casinoTransaction.game_id) AS name'
        },
          COALESCE(ROUND(SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalBetAmount",
          COALESCE(ROUND(SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' THEN ledger.amount ELSE 0 END)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalWinAmount",
          COALESCE(ROUND(SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' THEN ledger.amount ELSE 0 END)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalBetRollbackAmount",
          COALESCE(ROUND(SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' THEN ledger.amount ELSE 0 END)::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalWinRollbackAmount"
        FROM public.casino_transactions AS casinoTransaction
        INNER JOIN public.ledgers AS ledger
          ON casinoTransaction.id = ledger.transaction_id
          AND ledger.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
        INNER JOIN public.casino_games AS casinoGame
          ON casinoTransaction.game_id = casinoGame.id
        WHERE casinoTransaction.created_at <= '${toDate}'::TIMESTAMP
          AND casinoTransaction.created_at >= (SELECT COALESCE(MAX(till_date), '${fromDate}') FROM game_report_aggregates)
          ${currencyId ? `AND ledger.currency_id = ${currencyId}` : 'AND currency_id != 1'}
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
        GROUP BY
          ${tab === TAB_OPTIONS.PROVIDER ? 'casinoGame.casino_provider_id' : 'casinoTransaction.game_id'}
          ${currencyId ? ', ledger.currency_id' : ''}
      ),
      combined_data AS (
        SELECT * FROM filtered_aggregates
        UNION ALL
        SELECT * FROM filtered_transactions
      ),
      paginated_results AS (
      SELECT
        id,
        name,
        ${currencyId ? '"currencyId",' : ''}
        COALESCE(ROUND((SUM("totalBetAmount") - SUM("totalBetRollbackAmount"))::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalBetAmount",
        COALESCE(ROUND((SUM("totalWinAmount") - SUM("totalWinRollbackAmount"))::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "totalWinAmount",
        COALESCE(ROUND((SUM("totalBetAmount") - SUM("totalBetRollbackAmount"))::NUMERIC, 2) - ROUND((SUM("totalWinAmount") - SUM("totalWinRollbackAmount"))::NUMERIC, 2), CAST(0 AS DECIMAL(10, 2))) AS "gameRevenue",
        COALESCE(ROUND(((SUM("totalWinAmount") - SUM("totalWinRollbackAmount"))::NUMERIC / NULLIF((SUM("totalBetAmount") - SUM("totalBetRollbackAmount"))::NUMERIC, 0)) * 100, 2), CAST(0 AS DECIMAL(10, 2))) AS "payout",
        COUNT(*) OVER() AS "totalCount"
      FROM combined_data
      WHERE ${gameName ? `(name ILIKE '%${gameName}%')` : 'TRUE'}
      GROUP BY id, name ${currencyId ? ', "currencyId"' : ''}
      ORDER BY "${orderBy}" ${order}
      LIMIT :limit OFFSET :offset
      )
      SELECT
        (SELECT json_agg(t) FROM paginated_results t) AS "reportData",
        (SELECT MAX("totalCount") FROM paginated_results) AS "totalCount";
    `

      const totalGameStatsQuery = `
      SELECT

      ROUND(CAST(
        SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END)
      -
        SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' THEN ledger.amount ELSE 0 END)
      AS NUMERIC), 2) AS "totalBetAmount",

      ROUND(CAST(
        SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' THEN ledger.amount ELSE 0 END)
      -
        SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' THEN ledger.amount ELSE 0 END)
      AS NUMERIC), 2) AS "totalWinAmount",

      ROUND(CAST(
        (SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END)
      -
        SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' THEN ledger.amount ELSE 0 END))
      -
        (SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' THEN ledger.amount ELSE 0 END)
      -
         SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' THEN ledger.amount ELSE 0 END))
      AS NUMERIC), 2) AS "totalNetProfit"

      FROM public.casino_transactions AS casinoTransaction
      INNER JOIN public.ledgers AS ledger
      ON casinoTransaction.id = ledger.transaction_id
      AND ledger.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'
      INNER JOIN public.casino_games AS casinoGame
      ON casinoTransaction.game_id = casinoGame.id

      WHERE casinoTransaction.created_at BETWEEN '${fromDate}' AND '${toDate}'
      AND ledger.purpose IN(
        '${LEDGER_PURPOSE.CASINO_BET}',
        '${LEDGER_PURPOSE.CASINO_WIN}',
        '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}',
        '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}'
      )
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
      ${gameName
      ? `
        AND EXISTS (
        SELECT 1
        FROM jsonb_each_text(
          ${tab === TAB_OPTIONS.PROVIDER
            ? '(SELECT name FROM public.casino_providers WHERE id = casinoGame.casino_provider_id)'
            : 'casinoGame.name'
          }
        ) AS lang(name, value)
        WHERE value ILIKE '%${gameName}%'
      )`
      : ''}
      ${currencyId ? `AND ledger.currency_id = ${currencyId}` : 'AND ledger.currency_id != 1'}
      `

      if (csvDownload === 'true') {
        const stream = new Readable({ objectMode: true, read (size) { } })

        const offset = 0
        const limit = 10000

        async function fetchAndPush ({ limit, offset, context }) {
          try {
            const [{ reportData: combinedChunk }] = await context.sequelize.query(query, {
              type: context.sequelize.QueryTypes.SELECT,
              replacements: { limit, offset },
              raw: true
            })

            if (combinedChunk?.length > 0) {
              const modifiedChunk = combinedChunk.map(({
                name,
                gameRevenue,
                totalBetAmount,
                totalWinAmount
              }) => {
                return {
                  Name: name,
                  'Total Revenue': gameRevenue || 0,
                  'Total Wagered': totalBetAmount || 0,
                  'Total Payout': totalWinAmount || 0,
                  'RTP (%)': totalBetAmount > 0
                    ? (
                        (parseFloat(totalWinAmount) /
                        parseFloat(totalBetAmount)) *
                      100
                      ).toFixed(2)
                    : '0.00'
                }
              })

              const json2csv = new Parser()
              const csv = json2csv.parse(modifiedChunk)

              stream.push(csv + '\n')
              offset += limit

              setImmediate(() => fetchAndPush({
                limit, offset, context
              }))
            } else {
              // End the stream when no more data
              setImmediate(() => stream.push(null))
            }
          } catch (error) {
            console.log('Stream Error:', error)
            stream.destroy(error)
          }
        }

        // Start fetching
        fetchAndPush({ limit, offset, context: this.context })

        return { stream }
      }
      let totalGameStats = [[{}]]
      if (type === 'report') {
        totalGameStats = await this.context.sequelize.query(totalGameStatsQuery, { logging: false })
      }

      const result = await this.context.sequelize.query(query, {
        type: this.context.sequelize.QueryTypes.SELECT,
        replacements: { limit: perPage, offset: (page - 1) * perPage },
        logging: false
      })
      const gameReport = result[0]?.reportData || []
      const totalCount = result[0]?.totalCount

      return { gameReport, totalBetAmount: totalGameStats[0][0]?.totalBetAmount || 0, totalWinAmount: totalGameStats[0][0]?.totalWinAmount || 0, totalNetProfit: totalGameStats[0][0]?.totalNetProfit || 0, totalPages: totalCount ? Math.ceil(totalCount / perPage) : 0 }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
