import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { ServiceBase } from '@src/libs/serviceBase'
import { getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    csvDownload: { type: 'boolean', default: false },
    dateOptions: { enum: Object.values(REPORT_TIME_PERIOD_FILTER), default: REPORT_TIME_PERIOD_FILTER.CUSTOM },
    currencyId: { type: 'string', default: '1' },
    countries: { type: 'array' }
  }
})

export class GetDemographService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const csvDownload = this.args.csvDownload
    const dateOptions = this.args.dateOptions
    const countries = this.args.countries
    const dateFilter = {}

    try {
      if (!csvDownload) {
        const { fromDate, toDate } = getReportDates(dateOptions, this.args.fromDate || dayjs().startOf('day'), this.args.toDate || dayjs().endOf('day'))
        dateFilter.createdAt = alignDatabaseDateFilter(fromDate, toDate)
      }
      const users = await this.context.sequelize.models.user.findAll({
        attributes: [
          [Sequelize.fn('ARRAY_AGG', Sequelize.col('user.id')), 'userIds'],
          [Sequelize.col('country_id'), 'countryId']
        ],
        where: dateFilter,
        include: {
          model: this.context.sequelize.models.country,
          where: countries ? { code: { [Op.in]: countries } } : {},
          attributes: ['id', 'code', 'name']
        },
        group: [Sequelize.col('country_id'), Sequelize.col('country.id')],
        raw: true
      })

      const demograph = await Promise.all(users.map(async user => {
        const countryDemograph = {
          countryCode: user['country.code'],
          countryName: user['country.name']
        }
        const query = `SELECT SUM(l.amount) AS total_deposit_amount, l.currency_id AS currency_id FROM
           ledgers AS l JOIN wallets AS w ON l.to_wallet_id = w.id OR l.from_wallet_id = w.id
               WHERE l.purpose = '${LEDGER_PURPOSE.PURCHASE}' and w.user_id in (${user.userIds})
            GROUP BY l.currency_id`

        const [depositorData] = await this.context.sequelize.query(query)
        countryDemograph.deposits = depositorData.map(data => ({
          depositAmount: +data.total_deposit_amount || 0,
          depositorCount: +user.userIds.length || 0,
          currencyId: data.currency_id
        }))
        countryDemograph.signUpCount = user.userIds.length

        return countryDemograph
      }))
      return { demograph }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
