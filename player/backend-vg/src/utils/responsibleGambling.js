import db from '../db/models'
import { Op } from 'sequelize'
import { getAll } from './crud'
import { RESPONSIBLE_GAMBLING_LIMIT, RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE, ACTION } from './constants/constant'

export const getLimitDates = () => {
  const today = new Date()

  let date = new Date()
  const offset = date.getTimezoneOffset()

  let monthStartDate = new Date((new Date(date.getFullYear(), date.getMonth(), 1)).getTime() - (offset * 60 * 1000))
  monthStartDate = monthStartDate.toISOString().split('T')[0]

  date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)

  const weekStartDate = new Date(date.setDate(diff))

  return {
    today: today.toISOString().substring(0, 10),
    monthStartDate,
    weekStartDate: weekStartDate.toISOString().substring(0, 10)
  }
}

export const filterByDateCreatedAt = (query, startDate = null, endDate = null, modelName) => {
  endDate = endDate || Date.now()

  if (startDate) {
    query = {
      ...query,
      createdAt: {
        [Op.and]: {
          [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
          [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
        }
      }
    }
  } else {
    query = {
      ...query,
      [Op.or]: {
        createdAt: { [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00` }
      }
    }
  }

  return query
}

export const getDepositLimitAmounts = async ({ userId }) => {
  const defaultQuery = {
    actioneeType: ROLE.USER,
    actioneeId: userId,
    transactionType: TRANSACTION_TYPE.DEPOSIT,
    status: TRANSACTION_STATUS.SUCCESS
  }

  const { today, monthStartDate, weekStartDate } = getLimitDates()
  const todayQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), today, today, 'TransactionBanking')
  const monthQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), monthStartDate, today, 'TransactionBanking')
  const weekQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), weekStartDate, today, 'TransactionBanking')

  return {
    totalDepositAmountToday: await db.TransactionBanking.sum('amount', { where: todayQuery }) || 0,
    totalDepositAmountWeekly: await db.TransactionBanking.sum('amount', { where: weekQuery }) || 0,
    totalDepositAmountMonthly: await db.TransactionBanking.sum('amount', { where: monthQuery }) || 0
  }
}

export const checkDepositLimit = async ({ userId, depositAmount }) => {
  const userLimits = await getAll({
    model: db.ResponsibleGambling,
    data: {
      userId,
      responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.DEPOSIT,
      status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
    },
    order: [['limitType', 'ASC']],
    attributes: ['limitType', 'depositAmount'],
    raw: true
  })

  const { totalDepositAmountToday, totalDepositAmountWeekly, totalDepositAmountMonthly } = await getDepositLimitAmounts({ userId })

  const limitTable = {}

  if (userLimits && userLimits?.length) {
    for (const limit of userLimits) {
      if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.DAILY) limitTable.dailyDepositLimit = limit?.depositAmount
      else if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.WEEKLY) limitTable.weeklyDepositLimit = limit?.depositAmount
      else if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.MONTHLY) limitTable.monthlyDepositLimit = limit?.depositAmount
    }
  }

  if (limitTable?.dailyDepositLimit && totalDepositAmountToday + depositAmount > limitTable?.dailyDepositLimit) {
    return { limitReached: true, message: 'Daily Deposit limit reached', limitAmount: limitTable?.dailyDepositLimit, limitType: RESPONSIBLE_GAMBLING_LIMIT.DAILY }
  }
  if (limitTable?.weeklyDepositLimit && totalDepositAmountWeekly + depositAmount > limitTable?.weeklyDepositLimit) {
    return { limitReached: true, message: 'Weekly Deposit limit reached', limitAmount: limitTable?.weeklyDepositLimit, limitType: RESPONSIBLE_GAMBLING_LIMIT.WEEKLY }
  }
  if (limitTable?.monthlyDepositLimit && totalDepositAmountMonthly + depositAmount > limitTable?.monthlyDepositLimit) {
    return { limitReached: true, message: 'Monthly Deposit limit reached', limitAmount: limitTable?.monthlyDepositLimit, limitType: RESPONSIBLE_GAMBLING_LIMIT.MONTHLY }
  }

  return { limitReached: false }
}

export const checkResponsibleGamblingLimits = async (userId) => {
  // Query ResponsibleGambling records based on the criteria
  const userLimits = await db.ResponsibleGambling.findAll({
    where: {
      userId,
      responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.TIME,
      status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
    }
  })

  // Check if any of the limits have been reached
  for (const limit of userLimits) {
    const limitAmountInMinutes = limit?.amount

    if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.DAILY && limitAmountInMinutes <= limit?.totalAmount) {
      return { limitReached: true, message: 'Daily time limit reached' }
    } else if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.WEEKLY && limitAmountInMinutes <= limit?.totalAmount) {
      return { limitReached: true, message: 'Weekly time limit reached' }
    } else if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.MONTHLY && limitAmountInMinutes <= limit?.totalAmount) {
      return { limitReached: true, message: 'Monthly time limit reached' }
    }
  }

  // If none of the limits are reached
  return { limitReached: false, message: 'Limits have not been reached' }
}

export const checkResponsibleGamblingTimeBreakLimit = async (userId) => {
  // Query ResponsibleGambling records based on the criteria
  const userLimits = await db.ResponsibleGambling.findOne({
    where: {
      userId,
      responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK,
      status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
    }
  })

  // Get the current time
  const currentTime = new Date()

  // Parse the userLimits.timeBreakDuration into a Date object (assuming it's a valid date string)
  const timeBreakDuration = new Date(userLimits?.timeBreakDuration)

  // Check if any of the limits have been reached
  if (timeBreakDuration && currentTime < timeBreakDuration) {
    return { limitReached: true, message: 'You are excluded till ', date: timeBreakDuration }
  }

  return { limitReached: false }
  // If none of the limits are reached
}

export const getBetLimitAmounts = async ({ userId }) => {
  const defaultQuery = {
    actionType: ACTION.BET,
    userId,
    amountType: 1,
    status: TRANSACTION_STATUS.SUCCESS
  }

  const { today, monthStartDate, weekStartDate } = getLimitDates()

  const todayQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), today, today, 'CasinoTransaction')
  const monthQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), monthStartDate, today, 'CasinoTransaction')
  const weekQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), weekStartDate, today, 'CasinoTransaction')

  return {
    totalBetAmountToday: await db.CasinoTransaction.sum('amount', { where: todayQuery }),
    totalBetAmountWeekly: await db.CasinoTransaction.sum('amount', { where: weekQuery }),
    totalBetAmountMonthly: await db.CasinoTransaction.sum('amount', { where: monthQuery })
  }
}

export const checkBetLimit = async ({ userId, betAmount }) => {
  const userLimits = await getAll({
    model: db.ResponsibleGambling,
    data: {
      userId,
      responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.SESSION, // 1 for bet
      status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
    },
    order: [['limitType', 'ASC']],
    attributes: ['limitType', 'amount'],
    raw: true
  })

  const { totalBetAmountToday, totalBetAmountWeekly, totalBetAmountMonthly } = await getBetLimitAmounts({ userId })
  const limitTable = {}

  if (userLimits && userLimits?.length) {
    for (const limit of userLimits) {
      if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.DAILY) limitTable.dailyBetLimit = limit.amount
      else if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.WEEKLY) limitTable.weeklyBetLimit = limit.amount
      else if (limit.limitType === RESPONSIBLE_GAMBLING_LIMIT.MONTHLY) limitTable.monthlyBetLimit = limit.amount
    }
  }

  if (limitTable?.dailyBetLimit && totalBetAmountToday + betAmount > limitTable?.dailyBetLimit) {
    return { limitReached: true, message: 'Daily Bet limit reached', limitAmount: limitTable?.dailyBetLimit, limitType: RESPONSIBLE_GAMBLING_LIMIT.DAILY }
  }
  if (limitTable?.weeklyBetLimit && totalBetAmountWeekly + betAmount > limitTable?.weeklyBetLimit) {
    return { limitReached: true, message: 'Weekly Bet limit reached', limitAmount: limitTable?.weeklyBetLimit, limitType: RESPONSIBLE_GAMBLING_LIMIT.WEEKLY }
  }
  if (limitTable?.monthlyBetLimit && totalBetAmountMonthly + betAmount > limitTable?.monthlyBetLimit) {
    return { limitReached: true, message: 'Monthly Bet limit reached', limitAmount: limitTable?.monthlyBetLimit, limitType: RESPONSIBLE_GAMBLING_LIMIT.MONTHLY }
  }

  return { limitReached: false }
}
