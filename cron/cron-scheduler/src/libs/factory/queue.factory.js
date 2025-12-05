import { redisOptions } from '@src/configs'
import { Logger } from '@src/libs/logger'
import Bull from 'bull'
import Redis from 'ioredis'
import { queueWorkerRedisClient } from '../queueWorkerRedisClient'

/**
 * @typedef {object} KeepJobs
 * @property {number} age
 * @property {number} count
 *
 * @typedef {object} BackoffOpts
 * @property {string} type
 * @property {number} delay
 * @property {any} options
 *
 * @typedef {object} RepeatOpts
 * @property {string} cron
 * @property {string} tz
 * @property {Date | string | number} startDate
 * @property {Date | string | number} endDate
 * @property {number} limit
 * @property {number} every
 * @property {number} count
 * @property {string} key
 *
 * @typedef {object} MetricsOpts
 * @property {number} maxDataPoints
 *
 * @typedef {object} RateLimiter
 * @property {number} max
 * @property {number} duration
 * @property {boolean} bounceBack
 * @property {string} groupKey
 *
 * @typedef {object} AdvancedSettings
 * @property {number} lockDuration
 * @property {number} lockRenewTime
 * @property {number} stalledInterval
 * @property {number} maxStalledCount
 * @property {number} guardInterval
 * @property {number} retryProcessDelay
 * @property {number} backoffStrategies
 * @property {number} drainDelay
 * @property {boolean} isSharedChildPool
 *
 * @typedef {object} JobOpts
 * @property {number} attempts
 * @property {number | BackoffOpts} backoff
 * @property {boolean | number | KeepJobs} removeOnComplete
 * @property {number} priority
 * @property {number} delay
 * @property {RepeatOpts} repeat
 * @property {boolean} lifo
 * @property {number} timeout
 * @property {number | string} jobId
 * @property {boolean | number | KeepJobs} removeOnFail
 * @property {number} stackTraceLimit
 *
 * @typedef {object} QueueOptions
 * @property {RateLimiter} limiter
 * @property {JobOpts} defaultJobOptions
 * @property {string} prefix
 * @property {MetricsOpts} metrics
 * @property {AdvancedSettings} settings
 */

/**
 * To maintain queues at global level
 * @type {[import('bull/lib/queue')]}
 */
const queuesMeta = []

const connectionOptions = {
  ...redisOptions.queueWorkerRedisOptions,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
}

/**
 * @param {string} name
 * @param {QueueOptions} options
 */
function createQueue (name = 'Default-Queue', options = {}) {
  const queue = new Bull(name, {
    createClient: function (type, opts) {
      switch (type) {
        case 'client':
          return queueWorkerRedisClient.client
        case 'subscriber':
          return queueWorkerRedisClient.subscriberClient
        default:
          return new Redis(opts)
      }
    },
    redis: connectionOptions,
    ...options
  })

  queuesMeta.push(queue)
  Logger.info('QueueFactory', { message: `${name} created...` })

  return queue
}

/**
 * Function to close all queus at once
 */
async function close () {
  await Promise.all(queuesMeta.map(async queue => {
    await queue.pause(true)
    await queue.close(true)
    Logger.error('QueueFactory', { message: `${queue.name} closed...` })
  }))
}

export const queueFactory = {
  close,
  createQueue
}
