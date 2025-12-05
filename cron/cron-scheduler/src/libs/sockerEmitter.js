import { Emitter } from '@socket.io/redis-emitter'
import { pubSubRedisClient } from '@src/libs/pubSubRedisClient'

export const socketEmitter = new Emitter(pubSubRedisClient.publisherClient)
