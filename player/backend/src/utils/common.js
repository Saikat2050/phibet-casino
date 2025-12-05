import { dayjs, serverDayjs } from '@src/libs/dayjs'
import { TIME_PERIOD_FILTER } from './constants/app.constants'

/**
 * @param {?import('dayjs').Dayjs} startDate
 * @param {?import('dayjs').Dayjs} endDate
 * @returns
 */

export function getDates (filter, fromDate, toDate) {
  const today = serverDayjs().endOf('day')
  const startOfToday = today.startOf('day')

  switch (filter) {
    case TIME_PERIOD_FILTER.TODAY:
      fromDate = startOfToday.format()
      toDate = today.format()
      break
    case TIME_PERIOD_FILTER.YESTERDAY:
      fromDate = startOfToday.subtract(1, 'day')
      toDate = fromDate.endOf('day').format()
      fromDate = fromDate.format()
      break
    case TIME_PERIOD_FILTER.LAST_7_DAYS:
      fromDate = today.subtract(7, 'day').format()
      toDate = today.format()
      break
    case TIME_PERIOD_FILTER.LAST_30_DAYS:
      fromDate = today.subtract(30, 'day').format()
      toDate = today.format()
      break
    case TIME_PERIOD_FILTER.LAST_90_DAYS:
      fromDate = today.subtract(90, 'day').format()
      toDate = today.format()
      break
    case TIME_PERIOD_FILTER.MONTH_TO_DATE:
      fromDate = today.startOf('month').format()
      toDate = today.format()
      break
    case TIME_PERIOD_FILTER.CUSTOM:
      if (!fromDate) throw Error('fromDate required')
      fromDate = dayjs(fromDate).utc().format()
      toDate = toDate ? dayjs(toDate).utc().format() : dayjs()
      break
    default:
      fromDate = startOfToday.format()
      toDate = today.format()
      break
  }
  return { fromDate, toDate }
}

export function jackpotWinningTicketRnG (seedAmount, maxTicketSize, entryAmount) {
  const minTickets = +Math.ceil(+divide(+seedAmount, +entryAmount || 1))

  const winningTicket = crypto.randomInt(minTickets + 1, maxTicketSize)
  return winningTicket
}

export const pageValidation = (page, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(page)
  const sizeAsNumber = Number.parseInt(limit)
  let pageNo = 1
  let size = 15

  if (
    Number.isNaN(pageAsNumber) ||
    pageAsNumber < 0 ||
    Number.isNaN(sizeAsNumber) ||
    sizeAsNumber < 0 ||
    sizeAsNumber > maxSize
  ) {
    return { pageNo, size }
  }

  size = sizeAsNumber
  pageNo = pageAsNumber

  return { pageNo, size }
}
