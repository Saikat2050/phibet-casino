import { config } from './config'

/** @type {import('ioredis').RedisOptions} */
console.log("************************************************************************************************")
console.log("config.get('pub_sub_redis_db.host')", config.get('pub_sub_redis_db.host'))
console.log("config.get('pub_sub_redis_db.port')", config.get('pub_sub_redis_db.port'))
console.log("config.get('pub_sub_redis_db.password')", config.get('pub_sub_redis_db.password'))
console.log("config.get('queue_worker_redis_db.host')", config.get('queue_worker_redis_db.host'))
console.log("config.get('queue_worker_redis_db.port')", config.get('queue_worker_redis_db.port'))
console.log("config.get('queue_worker_redis_db.password')", config.get('queue_worker_redis_db.password'))
console.log("************************************************************************************************")

export const pubSubRedisOptions = {
  host: config.get('pub_sub_redis_db.host'),
  port: config.get('pub_sub_redis_db.port'),
  password: config.get('pub_sub_redis_db.password')
}

export const queueWorkerRedisOptions = {
  host: config.get('queue_worker_redis_db.host'),
  port: config.get('queue_worker_redis_db.port'),
  password: config.get('queue_worker_redis_db.password')
}
