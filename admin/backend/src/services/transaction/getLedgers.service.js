import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE, LEDGER_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op, Sequelize } from 'sequelize'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    type: { enum: Object.values(LEDGER_TYPES) },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    page: { type: 'number', minimum: 1, default: 1 },
    searchString: { type: 'string' },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'userId', 'amount', 'type', 'purpose', 'createdAt'], default: 'createdAt' },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    tagIds: { type: 'string' },
    csvDownload: { type: ['string', 'null'] },
    adminUserId: { type: 'string' }
  }
})

export class GetLedgersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      page,
      perPage,
      purpose,
      dateOptions,
      fromDate: customFromDate,
      toDate: customToDate,
      order,
      orderBy,
      userId,
      searchString,
      tagIds,
      csvDownload
    } = this.args

    try {
      const where = {}
      if (purpose) where.purpose = purpose

      const { fromDate, toDate } = getReportDates(dateOptions, customFromDate || serverDayjs().startOf('day'), customToDate || serverDayjs().endOf('day'))
      where.createdAt = { [Op.and]: [{ [Op.gte]: fromDate }, { [Op.lte]: toDate }] }

      const conditions = []

      if (searchString) {
        conditions.push(
          { '$fromWallet.user.username$': { [Op.like]: `%${searchString}%` } },
          { '$fromWallet.user.email$': { [Op.like]: `%${searchString}%` } },
          { '$toWallet.user.username$': { [Op.like]: `%${searchString}%` } },
          { '$toWallet.user.email$': { [Op.like]: `%${searchString}%` } }
        )
      }

      if (userId) {
        conditions.push(
          { '$fromWallet.user.id$': userId },
          { '$toWallet.user.id$': userId }
        )
      }

      const tagCondition = tagIds
        ? Sequelize.literal(`
      (EXISTS (
        SELECT 1
        FROM public.user_tags ut
        INNER JOIN public.tags tg ON ut.tag_id = tg.id
        WHERE (
          (ut.user_id = "fromWallet->user".id AND "fromWallet->user".id IS NOT NULL)
          OR
          (ut.user_id = "toWallet->user".id AND "toWallet->user".id IS NOT NULL)
        )
        AND tg.tag = 'INTERNAL'
        AND tg.id = ${tagIds}
        AND ut.updated_at <= "ledger".created_at
      ))`)
        : (!userId && !searchString
            ? Sequelize.literal(`
      (NOT EXISTS (
        SELECT 1
        FROM public.user_tags ut
        INNER JOIN public.tags tg ON ut.tag_id = tg.id
        WHERE (
          (ut.user_id = "fromWallet->user".id AND "fromWallet->user".id IS NOT NULL)
          OR
          (ut.user_id = "toWallet->user".id AND "toWallet->user".id IS NOT NULL)
        )
        AND tg.tag = 'INTERNAL'
        AND ut.updated_at <= "ledger".created_at
      ))`)
            : {})
      async function fetchRecords ({ limit, offset, order, tagCondition, where, conditions, context }) {
        return await context.sequelize.models.ledger.findAndCountAll({
          attributes: { exclude: ['updatedAt'] },
          where: {
            ...where,
            ...(conditions.length ? { [Op.or]: conditions } : {}),
            ...(tagCondition ? { [Op.and]: tagCondition } : {})
          },
          include: [
            {
              as: 'fromWallet',
              attributes: ['id'],
              model: context.sequelize.models.wallet,
              include: {
                attributes: ['username', 'email', 'id'],
                model: context.sequelize.models.user
              }
            },
            {
              as: 'toWallet',
              attributes: ['id'],
              model: context.sequelize.models.wallet,
              include: {
                attributes: ['username', 'email', 'id'],
                model: context.sequelize.models.user
              }
            }
          ],
          limit,
          offset,
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

        async function fetchAndPush ({ limit, offset, order: [[orderBy, order]], tagCondition, where, conditions, context }) {
          try {
            const { rows: combinedChunk } = await fetchRecords({ limit, offset, order: [[orderBy, order]], tagCondition, where, conditions, context })

            if (combinedChunk?.length > 0) {
              const currencyMap = {
                1: 'GC Coins',
                2: 'BSC Coins',
                3: 'PSC Coins',
                4: 'RSC Coins'
              }

              const modifiedChunk = combinedChunk.map(({
                transactionId,
                fromWallet,
                toWallet,
                amount,
                purpose,
                currencyId,
                transactionType,
                createdAt
              }) => {
                const coinData = {
                  'GC Coins': 0,
                  'BSC Coins': 0,
                  'PSC Coins': 0,
                  'RSC Coins': 0
                }

                if (currencyMap[currencyId]) {
                  coinData[currencyMap[currencyId]] = amount
                }
                return {
                  'Transaction Id': transactionId,
                  From: fromWallet?.user?.username || superAdminUser?.username || null,
                  To: toWallet?.user?.username || superAdminUser?.username || null,
                  ...coinData,
                  Purpose: Object.entries(LEDGER_PURPOSE).find(([_, value]) => value === purpose)?.[0] || purpose,
                  'Transaction Type': transactionType,
                  date: createdAt
                }
              })

              const json2csv = new Parser()
              const csv = json2csv.parse(modifiedChunk)

              stream.push(csv + '\n')
              offset += limit
              setImmediate(() => fetchAndPush({
                limit, offset, order: [[orderBy, order]], tagCondition, where, conditions, context
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
        fetchAndPush({ limit, offset, order: [[orderBy, order]], tagCondition, where, conditions, context: this.context })
        return { stream }
      }

      const ledgers = await fetchRecords({ limit: perPage, offset: (page - 1) * perPage, order: [[orderBy, order]], tagCondition, where, conditions, context: this.context })

      return {
        ledgers: ledgers.rows,
        page,
        totalPages: Math.ceil(ledgers.count / perPage)
      }
    } catch (error) {
      throw new APIError(error.message || 'An error occurred while fetching ledgers.')
    }
  }
}
