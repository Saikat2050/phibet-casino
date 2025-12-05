import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { closeRedisConnections } from './queueWorkerRedisClient'

let signalReceived = false
async function gracefulShutdown (siganl) {
  try {
    if (signalReceived) return
    signalReceived = true
    Logger.info('Shutdown', { message: `Received ${siganl}` })

    await closeRedisConnections()
    await sequelize.close()
    Logger.error('Shutdown', { message: 'goodbye...' })
    process.exit(0)
  } catch (error) {
    Logger.error('Shutdown', { message: 'failed, exiting manually...', exception: error })
    process.exit(1)
  }
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGUSR2', gracefulShutdown)
