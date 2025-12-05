import { sequelize } from '@src/database/models'
import Logger from '@src/libs/logger'
import { checkRedisConnections } from '@src/libs/redis'

/**
 * @param {import('express').Request} _
 * @param {import('express').Response} res
 * @returns {void}
 */
export async function healthCheck (_, res) {
  const healthCheck = {
    healthy: false,
    timestamp: Date.now(),
    uptime: process.uptime()
  }

  try {
    await sequelize.authenticate()
    healthCheck.healthy = true
  } catch (error) {
    Logger.error('HealthCheck', { message: 'Unhealthy database', exception: error })
  }

  try {
    await checkRedisConnections()
    healthCheck.healthy = true
  } catch (error) {
    Logger.error('HealthCheck', { message: 'Unhealthy redis instances', exception: error })
  }

  if (healthCheck.healthy) res.status(200).json(healthCheck)
  else res.status(503).send('Health check failed')
}
