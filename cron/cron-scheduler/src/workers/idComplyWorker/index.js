import { idComplyQueue, JOB_PROCESS_IDCOMPLY_DATA } from '@src/queues/idComply.queue'
import path from 'path'

idComplyQueue.process(JOB_PROCESS_IDCOMPLY_DATA, 1, path.join(__dirname, './idComply.worker.js'))
