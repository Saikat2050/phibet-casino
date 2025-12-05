import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { getPastDatesForDeltaCalculations, getReportDates } from '@src/utils/common'
import { REPORT_TIME_PERIOD_FILTER } from '@src/utils/constants/app.constants'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyId: { type: 'string', default: '1' },
    csvDownload: { enum: ['true', 'false'] },
    tab: { enum: ['banking', 'casino'], default: 'banking' }
  },
  required: ['tab']
})

export class GetKpiSummaryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { tab, currencyId } = this.args

    const { fromDate: todayFromDate, toDate: todayToDate } = getReportDates(REPORT_TIME_PERIOD_FILTER.TODAY)
    const { fromDate: yesterdayFromDate, toDate: yesterdayToDate } = getReportDates(REPORT_TIME_PERIOD_FILTER.YESTERDAY)
    const { fromDate: monthToDateFromDate, toDate: monthToDateToDate } = getReportDates(REPORT_TIME_PERIOD_FILTER.MONTH_TO_DATE)
    const { pastFromDate: pastMonthToDateFromDate, pastToDate: pastMonthToDateToDate } = getPastDatesForDeltaCalculations(monthToDateFromDate, monthToDateToDate)

    const params = { currencyId, todayFromDate, todayToDate, yesterdayFromDate, yesterdayToDate, monthToDateFromDate, monthToDateToDate, pastMonthToDateFromDate, pastMonthToDateToDate }

    try {
      const queryTemplates = {
        casino: `
          WITH calculated_data AS (
            SELECT
              COUNT(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose = 'CasinoBet' THEN 1 ELSE NULL END) AS todayBetCount,
              COUNT(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose IN ('CasinoWin', 'CasinoRefund') THEN 1 ELSE NULL END) AS todayWinCount,
              SUM(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END) AS todayBetAmount,
              SUM(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose IN ('CasinoWin', 'CasinoRefund') THEN l.amount ELSE 0 END) AS todayWinAmount,

              COUNT(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose = 'CasinoBet' THEN 1 ELSE NULL END) AS yesterdayBetCount,
              COUNT(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose IN ('CasinoWin', 'CasinoRefund') THEN 1 ELSE NULL END) AS yesterdayWinCount,
              SUM(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END) AS yesterdayBetAmount,
              SUM(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose IN ('CasinoWin', 'CasinoRefund') THEN l.amount ELSE 0 END) AS yesterdayWinAmount,

              COUNT(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = 'CasinoBet' THEN 1 ELSE NULL END) AS monthToDateBetCount,
              COUNT(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = 'CasinoWin' THEN 1 ELSE NULL END) AS monthToDateWinCount,
              SUM(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END) AS monthToDateBetAmount,
              SUM(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = 'CasinoWin' THEN l.amount ELSE 0 END) AS monthToDateWinAmount,

              COUNT(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose = 'CasinoBet' THEN 1 ELSE NULL END) AS pastMonthToDateBetCount,
              COUNT(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose IN ('CasinoWin', 'CasinoRefund') THEN 1 ELSE NULL END) AS pastMonthToDateWinCount,
              SUM(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose = 'CasinoBet' THEN l.amount ELSE 0 END) AS pastMonthToDateBetAmount,
              SUM(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose IN ('CasinoWin', 'CasinoRefund') THEN l.amount ELSE 0 END) AS pastMonthToDateWinAmount
            FROM ledgers AS l
            WHERE l.currency_id = :currencyId
              AND l.created_at BETWEEN :pastMonthToDateFromDate AND :todayToDate
              AND l.purpose IN ('CasinoWin', 'CasinoRefund', 'CasinoBet')
          )
          SELECT
            todayBetCount,
            todayBetAmount,
            todayWinCount,
            todayWinAmount,
            yesterdayBetCount,
            yesterdayBetAmount,
            yesterdayWinCount,
            yesterdayWinAmount,
            monthToDateBetCount,
            monthToDateBetAmount,
            monthToDateWinCount,
            monthToDateWinAmount,
            pastMonthToDateBetCount,
            pastMonthToDateBetAmount,
            pastMonthToDateWinCount,
            pastMonthToDateWinAmount
          FROM calculated_data
        `,
        banking: `
          WITH calculated_data AS (
            SELECT
              COUNT(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose = :depositPurpose THEN 1 ELSE NULL END) AS todayDepositCount,
              COUNT(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose = :withdrawPurpose THEN 1 ELSE NULL END) AS todayWithdrawCount,
              SUM(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose = :depositPurpose THEN l.amount ELSE 0 END) AS todayDepositAmount,
              SUM(CASE WHEN l.created_at BETWEEN :todayFromDate AND :todayToDate AND l.purpose = :withdrawPurpose THEN l.amount ELSE 0 END) AS todayWithdrawAmount,

              COUNT(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose = :depositPurpose THEN 1 ELSE NULL END) AS yesterdayDepositCount,
              COUNT(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose = :withdrawPurpose THEN 1 ELSE NULL END) AS yesterdayWithdrawCount,
              SUM(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose = :depositPurpose THEN l.amount ELSE 0 END) AS yesterdayDepositAmount,
              SUM(CASE WHEN l.created_at BETWEEN :yesterdayFromDate AND :yesterdayToDate AND l.purpose = :withdrawPurpose THEN l.amount ELSE 0 END) AS yesterdayWithdrawAmount,

              COUNT(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = :depositPurpose THEN 1 ELSE NULL END) AS monthToDateDepositCount,
              COUNT(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = :withdrawPurpose THEN 1 ELSE NULL END) AS monthToDateWithdrawCount,
              SUM(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = :depositPurpose THEN l.amount ELSE 0 END) AS monthToDateDepositAmount,
              SUM(CASE WHEN l.created_at BETWEEN :monthToDateFromDate AND :monthToDateToDate AND l.purpose = :withdrawPurpose THEN l.amount ELSE 0 END) AS monthToDateWithdrawAmount,

              COUNT(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose = :depositPurpose THEN 1 ELSE NULL END) AS pastMonthToDateDepositCount,
              COUNT(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose = :withdrawPurpose THEN 1 ELSE NULL END) AS pastMonthToDateWithdrawCount,
              SUM(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose = :depositPurpose THEN l.amount ELSE 0 END) AS pastMonthToDateDepositAmount,
              SUM(CASE WHEN l.created_at BETWEEN :pastMonthToDateFromDate AND :pastMonthToDateToDate AND l.purpose = :withdrawPurpose THEN l.amount ELSE 0 END) AS pastMonthToDateWithdrawAmount
            FROM ledgers AS l
            WHERE l.currency_id = :currencyId
              AND l.created_at BETWEEN :pastMonthToDateFromDate AND :todayToDate
              AND l.purpose IN (:depositPurpose, :withdrawPurpose)
          )
          SELECT
            todayDepositCount,
            todayWithdrawCount,
            todayDepositAmount,
            todayWithdrawAmount,
            yesterdayDepositCount,
            yesterdayWithdrawCount,
            yesterdayDepositAmount,
            yesterdayWithdrawAmount,
            monthToDateDepositCount,
            monthToDateWithdrawCount,
            monthToDateDepositAmount,
            monthToDateWithdrawAmount,
            pastMonthToDateDepositCount,
            pastMonthToDateWithdrawCount,
            pastMonthToDateDepositAmount,
            pastMonthToDateWithdrawAmount
          FROM calculated_data
        `
      }

      const depositPurpose = LEDGER_PURPOSE.DEPOSIT
      const withdrawPurpose = LEDGER_PURPOSE.WITHDRAW
      const query = queryTemplates[tab]
      const kpiSummary = (await sequelize.query(query, {
        replacements: { ...params, depositPurpose, withdrawPurpose }
      }))[0][0]

      return { kpiSummary }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
