import { JOB_PROCESS_SCALEO_DATA, ScaleoQueue } from '@src/queues/scaleo.queue'
import path from 'path'

ScaleoQueue.process(JOB_PROCESS_SCALEO_DATA, 1, path.join(__dirname, './scaleo.worker.js'))
