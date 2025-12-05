import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { QueryTypes } from 'sequelize'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
// import dayjs from 'dayjs'
// import { Parser } from 'json2csv'
import { formatSQLValue, SEGMENT_CATEGORIES, SQL_OPERATORS } from '@src/utils/constants/segmentation.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    searchString: { type: 'string' },
    download: { type: 'boolean', default: false },
    email: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    isAdvancedFilter: { type: 'boolean', default: false },
    advancedFilterConditions: {
      type: 'array',
      items: {
        type: 'object'
      }
    }
  },
  required: ['id', 'page', 'perPage']
})

export class GetSegmentationUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      args: { id, page, perPage, searchString, isAdvancedFilter = false, advancedFilterConditions, download },
      context: { models: { segmentation: segmentationModel }, sequelize }
    } = this

    try {
      let condition

      if (isAdvancedFilter) condition = advancedFilterConditions
      else {
        const segmentation = await segmentationModel.findOne({ where: { id }, raw: true })
        if (!segmentation) this.addError('SegmentDoesNotExistErrorType')
        condition = segmentation.condition
      }

      const selectAggregates = []
      const havingConditions = []
      const whereConditions = []
      const groupByColumn = []
      // const tables = []
      if (searchString) whereConditions.push(`users.username ILIKE '%${searchString}%' OR users.email ILIKE '%${searchString}%'`)

      condition.forEach(conditionGroup => {
        // for each condition group
        const orConditions = Object.keys(conditionGroup).map((segment) => {
          // get test segment here
          const segmentDetails = SEGMENT_CATEGORIES[segment]

          const { queryType, purpose = 'Redeem', filterColumn: column, lType, value } = segmentDetails
          const { op, value1, value2 } = conditionGroup[segment]
          const dataType = value
          const formattedValue = value1 ? formatSQLValue(value1, dataType) : value1
          const formattedValue2 = value2 ? formatSQLValue(value2, dataType) : value2

          if (queryType === 'aggregate') {
            if (lType === 'credit') {
              const aggregateField = `SUM(case when ledgers.purpose = '${purpose}' then ledgers.amount else 0 END) AS deposit_amount`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }

            if (lType === 'debit') {
              const aggregateField = `SUM(case when ledgers.purpose = '${purpose}' then ledgers.amount else 0 END) AS withdraw_amount`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              // Add condition to HAVING clause
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'wager') {
              const aggregateField = `SUM(case when ledgers.purpose = '${purpose}' then ledgers.amount else 0 END) AS wagering_amount`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              // Add condition to HAVING clause
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'signup') {
              // Add condition to WHERE clause
              const aggregateField = `users.created_at AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue}) * INTERVAL '1 day') AND DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue2}) * INTERVAL '1 day')`
              } else {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} ${formattedValue ? `DATE(NOW() - (CURRENT_DATE - DATE ${formattedValue}) * INTERVAL '1 day')` : `${formattedValue}`}`
              }
            }
            if (lType === 'gross_gaming_revenue') {
              // Add condition to WHERE clause
              const aggregateField = `(SUM(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_BET}' then ledgers.amount else 0 END)-SUM(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' then ledgers.amount else 0 END)) AS gross_gaming_revenue`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              // Add condition to HAVING clause
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'wagering_count') {
              // Add condition to WHERE clause
              const aggregateField = `COUNT(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_BET}' then ledgers.amount END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'deposit_count') {
              // Add condition to WHERE clause
              const aggregateField = `COUNT(case when ledgers.purpose = '${LEDGER_PURPOSE.DEPOSIT}' then ledgers.amount END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'withdraw_count') {
              // Add condition to WHERE clause
              const aggregateField = `COUNT(case when ledgers.purpose = '${LEDGER_PURPOSE.WITHDRAW}' then ledgers.amount END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'winning_amount') {
              // Add condition to WHERE clause
              const aggregateField = `SUM(case when ledgers.purpose = '${LEDGER_PURPOSE.CASINO_WIN}' then ledgers.amount else 0 END) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue}`
              }
            }
            if (lType === 'last_login') {
              // Add condition to WHERE clause
              const aggregateField = `users.logged_in_at AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue}) * INTERVAL '1 day') AND DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue2}) * INTERVAL '1 day')`
              } else {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} ${formattedValue ? `DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue}) * INTERVAL '1 day')` : `${formattedValue}`}`
              }
            }
            if (lType === 'last_played') {
              // Add condition to WHERE clause
              const aggregateField = `MIN(ledgers.created_at) AS ${lType}`
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue}) * INTERVAL '1 day') AND DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue2}) * INTERVAL '1 day')`
              } else {
                return `DATE(${aggregateField.split('AS')[0]}) ${SQL_OPERATORS[op]} ${formattedValue ? `DATE (NOW() - (CURRENT_DATE - DATE ${formattedValue}) * INTERVAL '1 day')` : `${formattedValue}`}`
              }
            }
          } else if (queryType === 'single') {
            const aggregateField = `${column}`

            if (lType === 'age') {
              const aggregateField = 'DATE_PART(\'year\',AGE(NOW(), users.date_of_birth)) AS age'
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
              }
              if (['BETWEEN', 'NOT BETWEEN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} AND ${formattedValue2}`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} `
              }
            } else if (lType === 'country') {
              const aggregateField = 'users.country_id AS country_id'
              const countryField = 'countries.name AS country'
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
                selectAggregates.push(`${countryField}`)
                groupByColumn.push(`${countryField.split('AS')[0]}`)
              }
              if (['IN', 'NOT IN'].includes(SQL_OPERATORS[op])) {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} (${formattedValue.join(',')})`
              } else {
                return `${aggregateField.split('AS')[0]} ${SQL_OPERATORS[op]} ${formattedValue} `
              }
            } else {
              if (!selectAggregates.includes(aggregateField)) {
                selectAggregates.push(`${aggregateField}`)
                groupByColumn.push(`${aggregateField}`)
              }

              return `${aggregateField} ${SQL_OPERATORS[op]} ${formattedValue}`
            }
          }
        })
        havingConditions.push(`(${orConditions.join(' OR ')})`)
      })
      if (download) {
        try {
          const queryString = `
        SELECT
          users.id,
          users.email,
          users.username,
          users.first_name,
          users.last_name
          ${selectAggregates.length > 0 ? ',' : ''}
          ${selectAggregates.join(', ')}
        FROM public.users
        left JOIN public.wallets on users.id = wallets.user_id
        LEFT JOIN public.countries on users.country_id = countries.id
        LEFT JOIN public.ledgers ON
        ledgers.from_wallet_id = wallets.id
        OR
        ledgers.to_wallet_id = wallets.id
        ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
         GROUP BY users.id, users.email, users.username, users.first_name, users.last_name ${groupByColumn.length > 0 ? ',' : ''}
        ${groupByColumn.join(' , ')}
        HAVING ${havingConditions.join(' AND ')} ;`

          await sequelize.query(queryString, {
            type: QueryTypes.SELECT,
            raw: true
          })
          // const parser = new Parser()
          // const segmentationFile = parser.parse(results)
          // const bufferData = Buffer.from(segmentationFile, 'utf8')
          return {}
        } catch (error) {
          throw new APIError(error)
        }
      }

      const query = `
        SELECT
          users.id,
          users.email,
          users.username,
          users.first_name,
          users.last_name,
          COUNT(*) OVER() AS total_count
          ${selectAggregates.length > 0 ? ',' : ''}
          ${selectAggregates.join(', ')}
        FROM public.users
        left JOIN public.wallets on users.id = wallets.user_id
        LEFT JOIN public.countries on users.country_id = countries.id
        LEFT JOIN public.ledgers ON
        ledgers.from_wallet_id = wallets.id
        OR
        ledgers.to_wallet_id = wallets.id
        ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
        GROUP BY users.id, users.email, users.username, users.first_name, users.last_name ${groupByColumn.length > 0 ? ',' : ''}
        ${groupByColumn.join(' , ')}
        HAVING ${havingConditions.join(' AND ')}
        LIMIT ${perPage}
        OFFSET ${(page - 1) * perPage}
      ;`

      const results = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })

      const count = results.length > 0 ? Number(results[0]?.total_count) : 0

      return { success: true, segmentationDetailsData: results, page, totalPages: Math.ceil(count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
