
import { cumulativeReportQueue, JOB_PROCESS_BONUS_REPORT_DATA, JOB_PROCESS_CUMULATIVE_GAME_REPORT_DATA, JOB_PROCESS_CUMULATIVE_PLAYER_REPORT_DATA, JOB_PROCESS_PERFORMANCE_DATA } from '@src/queues/cumulativeReport.queue'
import path from 'path'

cumulativeReportQueue.process(JOB_PROCESS_CUMULATIVE_GAME_REPORT_DATA, 1, path.join(__dirname, './cumulativeGameReport.worker.js'))
cumulativeReportQueue.process(JOB_PROCESS_CUMULATIVE_PLAYER_REPORT_DATA, 1, path.join(__dirname, './cumulativePlayerReport.worker.js'))
cumulativeReportQueue.process(JOB_PROCESS_PERFORMANCE_DATA, 1, path.join(__dirname, './cumulativePerformanceReport.worker.js'))
cumulativeReportQueue.process(JOB_PROCESS_BONUS_REPORT_DATA, 1, path.join(__dirname, './cumulativeBonusDataReport.worker.js'))
