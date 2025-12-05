import { queueWorkerRedisOptions } from '@src/configs/redis.config'
import { Logger } from '@src/libs/logger'
import Redis from 'ioredis'

/**
 * @typedef {object} RedisConnections
 * @property {Redis} client
 * @property {Redis} publisherClient
 * @property {Redis} subscriberClient
 */

const connectionOptions = {
  ...queueWorkerRedisOptions,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
}

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

export const queueWorkerRedisClient = {
  publisherClient: createRedisClient(connectionOptions),
  client: createRedisClient(connectionOptions),
  subscriberClient: createRedisClient({ ...connectionOptions, subscriberClient: true })
}

/**
 * Close all Redis connections.
 */
export const closeQueueWorkerRedisConnections = async () => {
  await Promise.all([
    queueWorkerRedisClient.publisherClient.quit(),
    queueWorkerRedisClient.client.quit(),
    queueWorkerRedisClient.subscriberClient.quit()
  ])
  Logger.info('RedisClient', { message: 'All Redis connections have been closed.' })
}

/**
 * Check all Redis connections and perform a health check.
 */
export const checkQueueWorkerRedisConnections = async () => {
  try {
    const isPublisherConnected = await queueWorkerRedisClient.publisherClient.ping() === 'PONG'
    const isSubscriberConnected = await queueWorkerRedisClient.subscriberClient.ping() === 'PONG'

    if (isPublisherConnected) {
      Logger.info('HealthCheck', { message: 'Queue-Worker Publisher Redis Connection: Active and responding.' })
    } else {
      Logger.error('RedisClient', { message: 'Queue-Worker Publisher Redis Connection: Failed to respond.' })
    }

    if (isSubscriberConnected) {
      Logger.info('HealthCheck', { message: 'Queue-Worker Subscriber Redis Connection: Active and responding.' })
    } else {
      Logger.error('RedisClient', { message: 'Queue-Worker Subscriber Redis Connection: Failed to respond.' })
    }

    // Return true if both connections are active and responding, otherwise return false
    return isPublisherConnected && isSubscriberConnected
  } catch (error) {
    Logger.error('RedisClient', { message: `Error in checking Redis clients: ${error.message}`, error })
    throw error
  }
}
