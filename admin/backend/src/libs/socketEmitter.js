import { Emitter } from '@socket.io/redis-emitter'
import { publisherClient } from '@src/libs/redis'

export const socketEmitter = new Emitter(publisherClient)
