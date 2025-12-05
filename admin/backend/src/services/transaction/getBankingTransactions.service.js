import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, LEDGER_TYPES, TRANSACTION_STATUS, CURRENCY, WITHDRAWAL_STATUS, STATUS_TYPE, LEDGER_PURPOSE_REPORT } from '@src/utils/constants/public.constants.utils'
import { Op, Sequelize } from 'sequelize'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    searchString: { type: 'string' },
    userId: { type: 'string' },
    actioneeId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    status: { enum: Object.values(TRANSACTION_STATUS) },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    type: { enum: Object.values(LEDGER_TYPES) },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'toWalletId', 'fromWalletIds', 'ledgerId', 'status', 'actioneeId', 'createdAt'], default: 'createdAt' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' },
    csvDownload: { type: ['string', 'null'] },
    adminUserId: { type: 'string' }
  }
})

export class GetBankingTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { status, userId, searchString, actioneeId, purpose, currencyId, dateOptions, tagIds, orderBy, order, page, perPage, csvDownload } = this.args

    try {
      // Construct date range and where conditions
      const { fromDate, toDate } = getReportDates(dateOptions, this.args.fromDate || serverDayjs().startOf('day'), this.args.toDate || serverDayjs().endOf('day'))

      const where = { createdAt: { [Op.between]: [fromDate, toDate] } }
      const nestedWhere = {}

      if (status) where.status = status
      if (actioneeId) where.actioneeId = actioneeId
      if (userId) where.userId = userId
      if (purpose) {
        if (purpose === LEDGER_PURPOSE.PURCHASE) nestedWhere.purpose = { [Op.in]: [LEDGER_PURPOSE.PURCHASE_GC_COIN, LEDGER_PURPOSE.PURCHASE_GC_BONUS, LEDGER_PURPOSE.PURCHASE_SC_BONUS, LEDGER_PURPOSE.PURCHASE_SC_COIN] }
        else nestedWhere.purpose = purpose
      } else {
        nestedWhere.purpose = { [Op.notIn]: [LEDGER_PURPOSE.CASINO_BET, LEDGER_PURPOSE.CASINO_WIN, LEDGER_PURPOSE.CASINO_REFUND, LEDGER_PURPOSE.CASINO_BET_ROLLBACK, LEDGER_PURPOSE.CASINO_WIN_ROLLBACK] }
      }
      // if (tagIds) where.tagId = { [Op.in]: tagIds.split(',') }

      // Queries to run in parallel
      const totalWithdrawCompletedAmountQuery = `
      SELECT
        COALESCE(SUM(l.amount), 0) AS "totalRedeemAmount"
      FROM ledgers l
      WHERE
        l.purpose = '${LEDGER_PURPOSE.REDEEM}'
        AND l.currency_id = ${CURRENCY.RSC}
        AND EXISTS (
          SELECT 1
          FROM withdrawals w
          WHERE w.transaction_id::BIGINT = l.transaction_id
          AND w.status = '${WITHDRAWAL_STATUS.APPROVED}'
          AND w.updated_at BETWEEN '${fromDate}' AND '${toDate}'
          ${tagIds
            ? `AND EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND tg.id = ${tagIds}
            AND ut.updated_at <= w.updated_at
          )`
          : (!searchString && !userId
? `AND NOT EXISTS (
            SELECT 1
            FROM public.user_tags ut
            INNER JOIN public.tags tg ON ut.tag_id = tg.id
            WHERE ut.user_id = w.user_id
            AND tg.tag = 'INTERNAL'
            AND ut.updated_at <= w.updated_at
          )`
 : '')}
          ${userId ? `AND w.user_id = ${userId}` : ''}
          ${searchString
            ? `AND w.user_id IN (SELECT id FROM users WHERE email ILIKE '%${searchString}%' OR username ILIKE '%${searchString}%')`
            : ''}
        );
      `

      const totalPurchaseAmountQuery = `
      SELECT
        COALESCE(SUM(t.amount), 0) AS "totalPurchaseAmount"
      FROM
        transactions t
      WHERE
        t.id IN ( SELECT DISTINCT l.transaction_id FROM ledgers l WHERE l.purpose IN ('${LEDGER_PURPOSE.PURCHASE_SC_BONUS}', '${LEDGER_PURPOSE.PURCHASE_GC_BONUS}', '${LEDGER_PURPOSE.PURCHASE_SC_COIN}', '${LEDGER_PURPOSE.PURCHASE_GC_COIN}') AND l.created_at BETWEEN '${fromDate}' AND '${toDate}')
        ${tagIds
        ? `AND EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = t.user_id
          AND tg.tag = 'INTERNAL'
          AND tg.id = ${tagIds}
          AND ut.updated_at <= t.created_at
        )`
        : (!searchString && !userId
? `AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = t.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.updated_at <= t.created_at
        )`
 : '')}
        ${userId ? `AND t.user_id = ${userId}` : ''}
        ${searchString
          ? `AND t.user_id IN (SELECT id FROM users WHERE email ILIKE '%${searchString}%' OR username ILIKE '%${searchString}%')`
          : ''};
      `

      async function fetchTransaction ({ limit, offset, order, nestedWhere, where, searchString, tagIds, context }) {
        return await context.sequelize.models.transaction.findAll({
          attributes: {
            exclude: ['updatedAt'],
            include: [
              [Sequelize.literal('COUNT("transaction"."id") OVER()'), 'totalCount']
            ]
          },
          where,
          include: [
            {
              as: 'transactionLedger',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              model: context.sequelize.models.ledger,
              where: nestedWhere,
              required: true
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
                        AND ut.updated_at <= "transaction".created_at
                      )`
                    : (!searchString && !userId
                        ? `NOT EXISTS (
                        SELECT 1
                        FROM public.user_tags ut
                        INNER JOIN public.tags tg ON ut.tag_id = tg.id
                        WHERE ut.user_id = "user".id
                        AND tg.tag = 'INTERNAL'
                        AND ut.updated_at <= "transaction".created_at
                      )`
                        : '')
                )
              }
            }
          ],
          limit,
          offset,
          order,
          logging: false
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

        async function fetchAndPush ({ limit, offset, order: [[orderBy, order]], nestedWhere, where, searchString, tagIds, context }) {
          try {
            const combinedChunk = await fetchTransaction({
              limit,
              offset,
              order: [[orderBy, order]],
              nestedWhere,
              where,
              searchString,
              tagIds,
              context
            })

            const fomattedData = []

            if (combinedChunk.length > 0) {
              const currencyMap = {
                1: 'GC Coins',
                2: 'BSC Coins',
                3: 'PSC Coins',
                4: 'RSC Coins'
              }

              combinedChunk?.forEach((transaction) => {
                const cleanedTransaction = JSON.parse(JSON.stringify(transaction))

                let purpose
                if (!cleanedTransaction?.transactionLedger?.length) {
                  purpose = 'Purchase'
                } else if (cleanedTransaction?.transactionLedger?.length > 1) {
                  const firstPurpose = cleanedTransaction?.transactionLedger?.[0]?.purpose
                  purpose = [
                    'PurchaseGcCoin',
                    'PurchaseScCoin',
                    'PurchaseGcBonus',
                    'PurchaseScBonus'
                  ].includes(firstPurpose)
                    ? 'Purchase'
                    : LEDGER_PURPOSE_REPORT?.find((p) => p?.value === firstPurpose)?.label
                } else {
                  const firstPurpose = cleanedTransaction?.transactionLedger?.[0]?.purpose
                  purpose = LEDGER_PURPOSE_REPORT?.find((p) => p?.value === firstPurpose)?.label
                }

                // Construct transaction data
                const transactionData = {
                  from: !cleanedTransaction?.transactionLedger?.[0]?.fromWalletId
                    ? superAdminUser?.username
                    : cleanedTransaction?.user?.username,
                  to: !cleanedTransaction?.transactionLedger?.[0]?.toWalletId
                    ? superAdminUser?.username
                    : cleanedTransaction?.user?.username,
                  'GC Coins': 0,
                  'BSC Coins': 0,
                  'PSC Coins': 0,
                  'RSC Coins': 0,
                  purpose,
                  status: STATUS_TYPE.find(
                    (status) => status.value === transaction?.status
                  )?.label,
                  'Payment ID': cleanedTransaction.paymentId,
                  Date: cleanedTransaction?.createdAt
                }

                cleanedTransaction.transactionLedger.forEach(({ currencyId, amount }) => {
                  if (currencyMap[currencyId]) {
                    transactionData[currencyMap[currencyId]] = amount
                  }
                })

                fomattedData.push(transactionData)
              })

              const modifiedChunk = fomattedData
              const json2csv = new Parser()
              const csv = json2csv.parse(modifiedChunk)

              stream.push(csv + '\n')
              offset += limit

              setImmediate(() => fetchAndPush({
                limit,
                offset: offset + limit,
                order: [[orderBy, order]],
                nestedWhere,
                where,
                searchString,
                tagIds,
                context
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
        fetchAndPush({ limit, offset, order: [[orderBy, order]], nestedWhere, where, searchString, tagIds, context: this.context })

        return { stream }
      }

      // Run queries in parallel
      const [totalAmountResult, transactions, purchaseAmount] = await Promise.all([
        this.context.sequelize.query(totalWithdrawCompletedAmountQuery, {
          replacements: { userId, fromDate, toDate, currencyId },
          type: this.context.sequelize.QueryTypes.SELECT
        }),
        fetchTransaction({ limit: perPage, offset: (page - 1) * perPage, order: [[orderBy, order]], nestedWhere, where, searchString, tagIds, context: this.context }),
        this.context.sequelize.query(totalPurchaseAmountQuery, {
          type: this.context.sequelize.QueryTypes.SELECT
        })
      ])

      const totalCount = transactions[0]?.dataValues?.totalCount || 0

      return { ...totalAmountResult[0], ...purchaseAmount[0], transactions, page, totalPages: Math.ceil(totalCount / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
