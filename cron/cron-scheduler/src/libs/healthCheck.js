import { sequelize } from '@src/database'
import Logger from '@src/libs/logger'
import { checkRedisConnections } from '@src/libs/pubSubRedisClient'
import { checkQueueWorkerRedisConnections } from '@src/libs/queueWorkerRedisClient'

/**
 * @param {import('express').Request} _
 * @param {import('express').Response} res
 * @returns {void}
 */
export async function healthCheck (_, res) {
  const healthCheck = {
    message: 'OK',
    healthy: true,
    timestamp: Date.now(),
    uptime: process.uptime()
  }

  try {
    await sequelize.authenticate()
  } catch (error) {
    healthCheck.healthy = false
    Logger.error('HealthCheck', { message: 'Unhealthy database', exception: error })
  }

  try {
    healthCheck.healthy = await checkRedisConnections()
    healthCheck.healthy = await checkQueueWorkerRedisConnections()
  } catch (error) {
    healthCheck.healthy = false
    Logger.error('HealthCheck', { message: 'Unhealthy redis instances', exception: error })
  }

  if (healthCheck.healthy) res.status(200).json(healthCheck)
  else res.status(503).send('Health check failed')
}
