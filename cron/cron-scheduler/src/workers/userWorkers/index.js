
import { JOB_PROCESS_USER_LIMIT, usersQueue } from '@src/queues/users.queue'
import path from 'path'

usersQueue.process(JOB_PROCESS_USER_LIMIT, 1, path.join(__dirname, './user.worker.js'))
