import { cumulativeReportQueue, JOB_PROCESS_BONUS_REPORT_DATA, JOB_PROCESS_CUMULATIVE_GAME_REPORT_DATA, JOB_PROCESS_CUMULATIVE_PLAYER_REPORT_DATA, JOB_PROCESS_PERFORMANCE_DATA } from '@src/queues/cumulativeReport.queue'

cumulativeReportQueue.add(JOB_PROCESS_CUMULATIVE_GAME_REPORT_DATA, {}, {
  repeat: { cron: '*/15 * * * *' },
  removeOnComplete: 100
})

cumulativeReportQueue.add(JOB_PROCESS_CUMULATIVE_PLAYER_REPORT_DATA, {}, {
  repeat: { cron: '*/15 * * * *' },
  removeOnComplete: 100
})

cumulativeReportQueue.add(JOB_PROCESS_PERFORMANCE_DATA, {}, {
  repeat: { cron: '*/15 * * * *' },
  removeOnComplete: 100
})

cumulativeReportQueue.add(JOB_PROCESS_BONUS_REPORT_DATA, {}, {
  repeat: { cron: '*/15 * * * *' },
  removeOnComplete: 100
})
