import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import { LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/public.constants.utils'
import { Op, Sequelize } from 'sequelize'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    gameId: { type: 'string' },
    walletId: { type: 'string' },
    transactionId: { type: 'string' },
    searchString: { type: 'string' },
    currencyId: { type: 'string' },
    gameName: { type: 'string' },
    conversionRate: { type: 'number' },
    previousTransactionId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    status: { enum: Object.values(CASINO_TRANSACTION_STATUS) },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'transactionId', 'userId', 'walletId', 'gameId', 'ledgerId', 'status', 'conversionRate', 'previousTransactionId', 'createdAt'], default: 'createdAt' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' },
    csvDownload: { type: ['string', 'null'] },
    adminUserId: { type: 'string' }
  }
})
export class GetCasinoTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dateOptions, page, status, userId, gameId, perPage, walletId,
      transactionId, previousTransactionId, currencyId, purpose, searchString,
      gameName, tagIds, csvDownload
    } = this.args

    try {
      const { fromDate, toDate } = getReportDates(
        dateOptions,
        this.args.fromDate || serverDayjs().startOf('day'),
        this.args.toDate || serverDayjs().endOf('day')
      )

      const where = {
        createdAt: { [Op.between]: [fromDate, toDate] },
        ...(status && { status }),
        ...(userId && { userId }),
        ...(gameId && { gameId }),
        ...(walletId && { walletId }),
        ...(transactionId && { transactionId }),
        ...(previousTransactionId && { previousTransactionId })
      }

      const ledgerWhere = {
        ...(purpose && { purpose }),
        ...(currencyId && { currencyId })
      }

      async function casinoTransaction ({ limit, offset, order, ledgerWhere, where, searchString, tagIds, gameName, context }) {
        return await context.sequelize.models.casinoTransaction.findAll({
          attributes: {
            exclude: ['updatedAt', 'userId', 'gameId', 'previousTransactionId', 'roundId', 'metaData'],
            include: [
              [Sequelize.literal('COUNT("casinoTransaction"."id") OVER()'), 'totalCount']
            ]
          },
          where,
          include: [
            {
              attributes: ['name', 'id', 'uniqueId'],
              model: context.sequelize.models.casinoGame,
              where: gameName ? { 'name.EN': { [Op.iLike]: `%${gameName}%` } } : {}
            },
            {
              attributes: ['username', 'email', 'id'],
              model: context.sequelize.models.user,
              where: {
                ...(
                  searchString
                    ? {
                        [Op.or]: [
                          { email: { [Op.like]: `%${searchString}%` } },
                          { username: { [Op.like]: `%${searchString}%` } }
                        ]
                      }
                    : {}
                ),
                [Op.and]: Sequelize.literal(
                  tagIds
                    ? `EXISTS (
                        SELECT 1
                        FROM public.user_tags ut
                        INNER JOIN public.tags tg ON ut.tag_id = tg.id
                        WHERE ut.user_id = "user".id
                        AND tg.tag = 'INTERNAL'
                        AND tg.id = ${tagIds}
                        AND ut.updated_at <= "casinoTransaction".created_at
                      )`
                    : (!searchString && !userId
                        ? `NOT EXISTS (
                        SELECT 1
                        FROM public.user_tags ut
                        INNER JOIN public.tags tg ON ut.tag_id = tg.id
                        WHERE ut.user_id = "user".id
                        AND tg.tag = 'INTERNAL'
                        AND ut.updated_at <= "casinoTransaction".created_at
                      )`
                        : '')
                )
              }
            },
            {
              as: 'casinoLedger',
              attributes: { exclude: ['createdAt', 'updatedAt', 'transactionId', 'transactionType'] },
              model: context.sequelize.models.ledger,
              // required: !!purpose,
              required: true,
              where: ledgerWhere
            }
          ],
          limit,
          offset,
          logging: false,
          benchmark: true,
          order
        })
      }

      if (csvDownload === 'true') {
        const superAdminUser = await this.context.sequelize.models.adminUser.findOne({
          attributes: ['username'],
          where: { id: this.args.adminUserId }
        })

        const stream = new Readable({ objectMode: true, read (size) { } })

        const offset = 0
        const limit = 10000

        async function fetchAndPush ({ limit, offset, order: [[orderBy, order]], ledgerWhere, where, searchString, tagIds, context, gameName }) {
          try {
            const combinedChunk = await casinoTransaction({ limit, offset, order: [[orderBy, order]], ledgerWhere, where, searchString, tagIds, context, gameName })

            if (combinedChunk.length > 0) {
              const currencyMap = {
                1: 'GC Coins',
                2: 'BSC Coins',
                3: 'PSC Coins',
                4: 'RSC Coins'
              }

              const modifiedChunk = combinedChunk.map(({
                id,
                gameId,
                casinoGame,
                casinoLedger = [],
                status,
                createdAt,
                transactionId,
                user
              }) => {
                const baseData = {
                  Id: id,
                  'Game Id': gameId || null,
                  'Game Name': casinoGame?.name?.EN || null,
                  From: casinoLedger.length && !casinoLedger[0].fromWalletId ? superAdminUser?.username : user?.username,
                  To: casinoLedger.length && !casinoLedger[0].toWalletId ? superAdminUser?.username : user?.username,
                  'GC Coins': 0,
                  'BSC Coins': 0,
                  'PSC Coins': 0,
                  'RSC Coins': 0,
                  'Action Type': casinoLedger?.length && casinoLedger[0]?.fromWalletId ? 'Debit' : 'Credit',
                  Purpose: new Set(), // Store unique purposes
                  'Transaction Id': transactionId,
                  Status: status,
                  Date: createdAt
                }

                casinoLedger.forEach(({ currencyId, amount, purpose }) => {
                  if (currencyMap[currencyId]) {
                    baseData[currencyMap[currencyId]] = amount
                  }

                  // Correctly match purpose using LEDGER_PURPOSE
                  const mappedPurpose = Object.entries(LEDGER_PURPOSE).find(([_, value]) => value === purpose)?.[0] || purpose
                  baseData.Purpose.add(mappedPurpose)
                })

                baseData.Purpose = Array.from(baseData.Purpose).join(', ') || null
                return baseData
              })

              const json2csv = new Parser()
              const csv = json2csv.parse(modifiedChunk)

              stream.push(csv + '\n')
              offset += limit

              setImmediate(() => fetchAndPush({
                limit, offset, order: [[orderBy, order]], ledgerWhere, where, searchString, tagIds, context, gameName
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
        fetchAndPush({ limit, offset, order: [[this.args.orderBy, this.args.order]], ledgerWhere, where, searchString, tagIds, context: this.context, gameName })

        return { stream }
      }

      const casinoTransactions = await casinoTransaction({ limit: perPage, offset: (page - 1) * perPage, order: [[this.args.orderBy, this.args.order]], ledgerWhere, where, searchString, tagIds, context: this.context, gameName })

      const totalCasinoStatsQuery = `
        SELECT
        ROUND(CAST(
          SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET}' THEN ledger.amount ELSE 0 END)
        -
          SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}' THEN ledger.amount ELSE 0 END) AS NUMERIC), 2)
        AS "totalBetAmount",

        ROUND(CAST(
          SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' THEN ledger.amount ELSE 0 END)
        -
          SUM(CASE WHEN ledger.purpose = '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}' THEN ledger.amount ELSE 0 END) AS NUMERIC), 2)
        AS "totalWinAmount"

        FROM public.casino_transactions AS casinoTransaction
        INNER JOIN public.ledgers AS ledger
        ON casinoTransaction.id = ledger.transaction_id
        AND ledger.transaction_type = '${LEDGER_TRANSACTION_TYPE.CASINO}'

        WHERE casinoTransaction.created_at BETWEEN '${fromDate}' AND '${toDate}'
        AND ledger.purpose IN(
          '${LEDGER_PURPOSE.CASINO_BET}',
          '${LEDGER_PURPOSE.CASINO_WIN}',
          '${LEDGER_PURPOSE.CASINO_BET_ROLLBACK}',
          '${LEDGER_PURPOSE.CASINO_WIN_ROLLBACK}'
        )
        ${tagIds
        ? `AND EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = casinoTransaction.user_id
          AND tg.tag = 'INTERNAL'
          AND tg.id = ${tagIds}
          AND ut.updated_at <= casinoTransaction.created_at
        )`
        : (!searchString && !userId
        ? `AND NOT EXISTS(
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = casinoTransaction.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= casinoTransaction.created_at
        )`
        : '')}
        ${userId ? `AND casinoTransaction.user_id = ${userId}` : ''}
        ${searchString
          ? `AND casinoTransaction.user_id IN (SELECT id FROM users WHERE email ILIKE '%${searchString}%' OR username ILIKE '%${searchString}%')`
          : ''}
        ${gameId ? `AND casinoTransaction.game_id = ${gameId}` : ''}
        ${gameName
        ? `
          AND EXISTS (
          SELECT 1
          FROM jsonb_each_text("casinoGame.name") AS lang(name, value)
          WHERE value ILIKE '%${gameName}%'
        )`
        : ''}
        ${currencyId ? `AND ledger.currency_id = ${currencyId}` : ''}
        ;
      `
      const totalCasinoStats = await this.context.sequelize.query(totalCasinoStatsQuery, {
        type: this.context.sequelize.QueryTypes.SELECT
      })

      const totalCount = casinoTransactions[0]?.dataValues?.totalCount || 0

      return {
        casinoTransactions,
        page,
        totalPages: Math.ceil(totalCount / perPage),
        totalBetAmount: totalCasinoStats[0]?.totalBetAmount || 0,
        totalWinAmount: totalCasinoStats[0]?.totalWinAmount || 0
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
