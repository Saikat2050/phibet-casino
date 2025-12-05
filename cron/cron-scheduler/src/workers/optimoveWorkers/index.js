import path from 'path'
import { JOB_OPTIMOVE_DATA, JOB_UPDATE_OPTIMOVE_DATA, optimoveQueue } from '@src/queues/optimove.queue'

optimoveQueue.process(JOB_OPTIMOVE_DATA, 1, path.join(__dirname, './provideData.worker'))
optimoveQueue.process(JOB_UPDATE_OPTIMOVE_DATA, 10, path.join(__dirname, './updateOptimoveData.worker'))
