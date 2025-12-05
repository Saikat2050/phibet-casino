import { config } from './config'

/** @type {import('ioredis').RedisOptions} */
export const redisOptions = {
  host: config.get('redis_db.host'),
  port: config.get('redis_db.port'),
  password: config.get('redis_db.password')
}
