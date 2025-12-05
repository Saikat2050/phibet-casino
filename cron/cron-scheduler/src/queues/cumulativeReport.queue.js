import { queueFactory } from '@src/libs/factory/queue.factory'
export const cumulativeReportQueue = queueFactory.createQueue('cumulativeReport-Queue', {
  limiter: {
    max: 1,
    duration: 200
  },
  defaultJobOptions: {
    attempts: 1,
    backoff: 60000
  }
})

export const JOB_PROCESS_CUMULATIVE_GAME_REPORT_DATA = 'cumulativeGameReportData'

export const JOB_PROCESS_CUMULATIVE_PLAYER_REPORT_DATA = 'cumulativePlayerReportData'

export const JOB_PROCESS_PERFORMANCE_DATA = 'performanceReportData'

export const JOB_PROCESS_BONUS_REPORT_DATA = 'bonusReportData'
