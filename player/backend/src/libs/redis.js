import { redisOptions } from '@src/configs'
import { Logger } from '@src/libs/logger'
import Redis from 'ioredis'

/**
 * @typedef {object} RedisConnections
 * @property {Redis} client
 * @property {Redis} publisherClient
 * @property {Redis} subscriberClient
 */

/**
 * Create a Redis client with the provided options.
 * @param {object} options - Redis connection options.
 * @returns {Redis} A new Redis instance.
 */
const createRedisClient = (options) => {
  const client = new Redis(options)

  client.on('error', (err) => {
    Logger.error(`Error in connecting to Redis client: ${err.message}`, err)
  })

  client.on('close', () => {
    Logger.error('RedisClient', { message: 'Redis client connection closed.' })
  })

  client.on('connect', () => {
    Logger.info('RedisClient', { message: 'Redis client connected.' })
  })

  return client
}

export const publisherClient = createRedisClient(redisOptions)
export const client = createRedisClient(redisOptions)
export const subscriberClient = createRedisClient({ ...redisOptions, subscriberClient: true })

/**
 * Close all Redis connections.
 */
export const closeRedisConnections = async () => {
  await Promise.all([
    publisherClient.quit(),
    client.quit(),
    subscriberClient.quit()
  ])
  Logger.info('RedisClient', { message: 'All Redis connections have been closed.' })
}

/**
 * Check all Redis connections.
 */
export const checkRedisConnections = async () => {
  try {
    const results = await Promise.all([
      publisherClient.ping(),
      client.ping(),
      subscriberClient.ping()
    ])

    results.forEach((result, index) => {
      if (result === 'PONG' || (Array.isArray(result) && result[0].toUpperCase() === 'PONG')) {
        Logger.info('RedisClient', { message: `Redis client ${index + 1} is connected and responsive.` })
      } else {
        Logger.error('RedisClient', { message: `Redis client ${index + 1} did not respond with PONG.` })
      }
    })
    return results
  } catch (error) {
    Logger.error('RedisClient', { message: `Error in checking Redis clients: ${error.message}`, error })
    throw error
  }
}
