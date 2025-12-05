import { createAdapter } from '@socket.io/redis-adapter'
import { pubSubRedisClient } from '@src/libs/pubSubRedisClient'
import { Server as SocketServer } from 'socket.io'
import { registerNamespaces } from './namespaces'

const socketServer = new SocketServer({
  cors: { origin: '*' },
  path: '/api/socket'
})

socketServer.adapter(createAdapter(pubSubRedisClient.publisherClient, pubSubRedisClient.subscriberClient))
registerNamespaces(socketServer)

export { socketServer }
