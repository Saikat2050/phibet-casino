// import { QueryTypes, Op } from 'sequelize'
// import { sequelize } from '../../../db/models'
// import { divide, round } from 'number-precision'
import { ServiceBase } from '@src/libs/serviceBase'
// import { SUCCESS_MSG } from '../../../utils/constants/success'
// import { JACKPOT_STATUS } from '../../../utils/constants/constant'

export class GetJackpotGraphService extends ServiceBase {
  // async run () {
  //   const { timeInterval = 'auto', startDate, endDate } = this.args
  //   const { cumulativeStartDate, cumulativeEndDate, liveStartDate, liveEndDate } = this.calculateDates(startDate, endDate)

  //   const [cumulativeData, liveData] = await Promise.all([
  //     cumulativeStartDate && cumulativeEndDate && this.getCumulativeData(cumulativeStartDate, cumulativeEndDate, timeInterval),
  //     liveStartDate && liveEndDate && this.getLastHourData(liveStartDate, liveEndDate, timeInterval)
  //   ])

  //   return {
  //     success: true,
  //     dateFormat: this.dateFormat(timeInterval, startDate, endDate),
  //     message: SUCCESS_MSG.GET_SUCCESS,
  //     data: this.mergeIntervalData(cumulativeData ?? [], liveData ?? [])
  //   }
  // }

  calculateDates () {
    let { startDate, endDate } = this.args

    startDate = new Date(startDate)
    endDate = new Date(endDate)

    // setting startDate to last half hour
    startDate.setMinutes(Math.floor(startDate.getMinutes() / 30) * 30, 0, 0)

    // setting endDate to next half hour
    endDate.setMinutes((Math.floor(endDate.getMinutes() / 30) * 30) + 30, 59, 999)

    if (startDate > endDate) return { cumulativeStartDate: null, cumulativeEndDate: null, liveStartDate: null, liveEndDate: null }

    const date = new Date()
    const aggregatedEndDate = new Date(date)
    aggregatedEndDate.setMinutes(Math.floor(date.getMinutes() / 30) * 30 - 61)
    aggregatedEndDate.setSeconds(59)
    aggregatedEndDate.setMilliseconds(999)

    if (aggregatedEndDate > new Date(endDate)) {
      return {
        cumulativeStartDate: new Date(startDate),
        cumulativeEndDate: new Date(endDate),
        liveStartDate: null,
        liveEndDate: null
      }
    }

    const sumStartDate = new Date(aggregatedEndDate)
    sumStartDate.setMilliseconds(aggregatedEndDate.getMilliseconds() + 1)

    return {
      cumulativeStartDate: startDate,
      cumulativeEndDate: aggregatedEndDate,
      liveStartDate: sumStartDate,
      liveEndDate: endDate
    }
  }

  getAssignedGraphInterval (timeInterval, startDate, endDate) {
    if (timeInterval && timeInterval !== 'auto') return timeInterval
    const ms = new Date(endDate) - new Date(startDate)
    const totalMinutes = ms / (1000 * 60)
    const totalPoints = 10

    const idealBucketSize = totalMinutes / totalPoints

    if (idealBucketSize <= 30) return '30-minutes'
    if (idealBucketSize <= 60) return 'hour'
    if (idealBucketSize <= 180) return '3-hours'
    if (idealBucketSize <= 720) return '12-hours'
    if (idealBucketSize <= 1440) return 'day'
    if (idealBucketSize <= 4320) return '3-days'
    if (idealBucketSize <= 10080) return 'week'
    return 'month'
  }

  dateFormat (timeInterval, startDate, endDate) {
    const graphInterval = this.getAssignedGraphInterval(timeInterval, startDate, endDate)
    let dateFormat
    if (['30-minutes', 'hour', '3-hours', '12-hours'].includes(graphInterval)) dateFormat = 'hh:mm'
    else if (['day', '3-days', 'week'].includes(graphInterval)) dateFormat = 'MM-DD'
    else dateFormat = 'YY-MM'
    return dateFormat
  }

  async getCumulativeData (startDate, endDate, timeInterval) {
    const graphInterval = this.getAssignedGraphInterval(timeInterval, startDate, endDate)
    const data = await sequelize.query(`
      SELECT CASE 
        WHEN :interval = '30-minutes' THEN date_trunc('hour', "timestamp") + FLOOR(EXTRACT(minute FROM "timestamp") / 30) * INTERVAL '30 minutes' 
        WHEN :interval = '3-days' THEN date_trunc('day', "timestamp") - ((EXTRACT(DAY FROM "timestamp")::int - 1) % 3) * INTERVAL '1 day'
        WHEN :interval = '3-hours' THEN date_trunc('hour', "timestamp") - (EXTRACT(hour FROM "timestamp")::int % 3) * INTERVAL '1 hour'
        WHEN :interval = '12-hours' THEN date_trunc('hour', "timestamp") - (EXTRACT(hour FROM "timestamp")::int % 12) * INTERVAL '1 hour'
        ELSE date_trunc(:interval, "timestamp") END AS intervals,
        ROUND(SUM(jackpot_revenue)::numeric, 2) AS "jackpotRevenue",
        ROUND(SUM(jackpot_entries)::numeric, 2) AS "spinCount",
        ROUND(SUM(total_bet_count)::numeric, 2) AS "totalBetCount",
        CASE WHEN ROUND(SUM(total_bet_count)::numeric, 2) = 0 THEN 0 ELSE ROUND((SUM(jackpot_entries)/SUM(total_bet_count))::numeric, 2) END AS "optInRate",
        ROUND(SUM(jackpot_opted_in_users)::numeric, 2) AS "newlyOptedInUsers"
      FROM dashboard_reports
      WHERE "timestamp" BETWEEN :startDate AND :endDate
      GROUP BY intervals
      ORDER BY intervals ASC
    `, {
      replacements: {
        interval: graphInterval,
        startDate,
        endDate
      },
      type: QueryTypes.SELECT
    })

    return data
  }

  async getLastHourData (startDate, endDate, timeInterval) {
    const graphInterval = this.getAssignedGraphInterval(timeInterval, startDate, endDate)

    const jackpotQuery = await this.jackpotQueryMaker(startDate, endDate)

    const data = await sequelize.query(`
      WITH casino_data AS (
       SELECT CASE 
          WHEN :interval = '30-minutes' THEN date_trunc('hour', created_at) + FLOOR(EXTRACT(minute FROM created_at) / 30) * INTERVAL '30 minutes' 
          WHEN :interval = '3-days' THEN date_trunc('day', created_at) - ((EXTRACT(DAY FROM created_at)::int - 1) % 3) * INTERVAL '1 day'
          WHEN :interval = '3-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 3) * INTERVAL '1 hour'
          WHEN :interval = '12-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 12) * INTERVAL '1 hour'
          ELSE date_trunc(:interval, created_at) END AS intervals,
          ${jackpotQuery || '0 AS "jackpotRevenue"'},
          COUNT(CASE WHEN action_type = 'jackpotEntry' THEN 1 END) AS "spinCount",
          COUNT(CASE WHEN action_type = 'bet' AND amount_type = 1 THEN 1 END) AS "totalBetCount"
        FROM casino_transactions
        WHERE created_at BETWEEN :startDate AND :endDate AND status = 1
        GROUP BY intervals
      ),
      user_data AS (
        SELECT CASE 
          WHEN :interval = '30-minutes' THEN date_trunc('hour', created_at) + FLOOR(EXTRACT(minute FROM created_at) / 30) * INTERVAL '30 minutes' 
          WHEN :interval = '3-days' THEN date_trunc('day', created_at) - ((EXTRACT(DAY FROM created_at)::int - 1) % 3) * INTERVAL '1 day'
          WHEN :interval = '3-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 3) * INTERVAL '1 hour'
          WHEN :interval = '12-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 12) * INTERVAL '1 hour'
          ELSE date_trunc(:interval, created_at) END AS intervals,
          COUNT(*) AS "newlyOptedInUsers"
        FROM user_activities WHERE activity_type = 'user-jackpot-enabled' AND created_at BETWEEN :startDate AND :endDate
        GROUP BY intervals
    ),
     all_intervals AS (
      SELECT intervals FROM casino_data
        UNION
      SELECT intervals FROM user_data
    )
    SELECT
      ai.intervals,
      COALESCE(cd."jackpotRevenue", 0) AS "jackpotRevenue",
      COALESCE(cd."spinCount", 0) AS "spinCount",
      COALESCE(cd."totalBetCount", 0) AS "totalBetCount",
      CASE WHEN COALESCE(cd."totalBetCount", 0) = 0 THEN 0 ELSE ROUND((cd."spinCount" / cd."totalBetCount")::numeric, 2) END AS "optInRate",
      COALESCE(ud."newlyOptedInUsers", 0) AS "newlyOptedInUsers"
    FROM all_intervals ai
    LEFT JOIN casino_data cd ON ai.intervals = cd.intervals
    LEFT JOIN user_data ud ON ai.intervals = ud.intervals
    ORDER BY ai.intervals ASC;
    `, {
      replacements: {
        interval: graphInterval,
        startDate,
        endDate
      },
      type: QueryTypes.SELECT
    })

    return data
  }

  async jackpotQueryMaker (startDate, endDate) {
    const {
      dbModels: {
        Jackpot: JackpotModel
      }
    } = this.context

    const [newJackpotCreated, jackpotData] = await Promise.all([
      JackpotModel.findAll({
        attributes: ['jackpotId', 'seedAmount', 'startDate', 'endDate'],
        where: {
          startDate: { [Op.between]: [startDate, endDate] },
          status: [JACKPOT_STATUS.RUNNING, JACKPOT_STATUS.COMPLETED]
        },
        order: [['jackpotId', 'ASC']],
        raw: true
      }),
      JackpotModel.findAll({
        attributes: ['jackpotId', 'startDate', 'endDate', 'adminShare'],
        where: {
          [Op.or]: [
            { endDate: { [Op.between]: [startDate, endDate] } },
            { startDate: { [Op.between]: [startDate, endDate] } },
            { endDate: null }
          ],
          status: [JACKPOT_STATUS.RUNNING, JACKPOT_STATUS.COMPLETED]
        },
        order: [['jackpotId', 'ASC']],
        raw: true
      })
    ])

    const jackpotSeedAmount = newJackpotCreated.map(jackpot => jackpot.seedAmount).reduce((a, b) => a + b, 0)

    if (jackpotData.length === 0) return ''
    if (jackpotData.length === 1) {
      return `ROUND(SUM(CASE WHEN action_type = 'jackpotEntry' AND created_at BETWEEN '${new Date(startDate).toISOString()}' AND '${new Date(endDate).toISOString()}' THEN COALESCE(amount, 0)*${jackpotData[0].adminShare} ELSE 0 END)::numeric, 2) AS "jackpotRevenue"`
    }

    let jackpotQuery = 'ROUND(SUM(CASE WHEN action_type = \'jackpotEntry\' THEN (CASE'
    jackpotData.forEach((jackpot, index) => {
      if (index === 0) jackpotQuery += ` WHEN created_at BETWEEN '${new Date(startDate).toISOString()}' AND '${new Date(jackpot.endDate).toISOString()}' THEN COALESCE(amount, 0)*${jackpot.adminShare}`
      else if (jackpotData.length - 1 === index) jackpotQuery += ` WHEN created_at BETWEEN '${new Date(jackpot.startDate).toISOString()}' AND '${new Date(endDate).toISOString()}' THEN COALESCE(amount, 0)*${jackpot.adminShare}`
      else jackpotQuery += ` WHEN created_at BETWEEN '${new Date(jackpot.startDate).toISOString()}' AND '${new Date(jackpot.endDate).toISOString()}' THEN COALESCE(amount, 0)*${jackpot.adminShare}`
    })
    return jackpotQuery + ` ELSE 0 END) ELSE 0 END)::numeric, 2) - ${jackpotSeedAmount || 0} AS "jackpotRevenue"`
  }

  mergeIntervalData (array1, array2) {
    const merged = [...array1, ...array2]

    const result = Object.values(
      merged.reduce((acc, row) => {
        const key = row.intervals

        if (!acc[key]) {
          acc[key] = {
            intervals: key,
            jackpotRevenue: 0,
            spinCount: 0,
            totalBetCount: 0,
            newlyOptedInUsers: 0
          }
        }

        acc[key].jackpotRevenue += +row.jackpotRevenue || 0
        acc[key].spinCount += +row.spinCount || 0
        acc[key].totalBetCount += +row.totalBetCount || 0
        acc[key].newlyOptedInUsers += +row.newlyOptedInUsers || 0

        return acc
      }, {})
    )

    // Optional: compute opt-in rate
    return result.map(row => ({
      ...row,
      optInRate: +round(+divide(+row.spinCount, +row.totalBetCount || 1), 2)
    }))
  }
}
