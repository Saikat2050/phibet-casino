import Jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { Server as SocketServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'

import Logger from '../libs/logger'
import redisClient from './redisClient'
import config from '../configs/app.config'
import { liveLoginUser, liveLogoutUser } from '../utils/common'

const MAX_CONNECTION_PER_USER = config.get('socket.maxPerUserConnection')

const socketServerOptions = {
  cors: { origin: '*' }
}

// To decode encrypted JWT token
const decodeSocketToken = (token) => {
  return CryptoJS.AES.decrypt(token, config.get('socket.encryptionKey')).toString(CryptoJS.enc.Utf8)
}

// To validate jwt token and get user details
const validateSocketToken = async (token) => {
  let success = false
  let user = null
  try {
    user = Jwt.verify(token, config.get('jwt.loginTokenSecret'))
    if (user) success = true
    return { success, user }
  } catch {
    return { success, user }
  }
}

// Socket authentication middleware
const socketAuthentication = async (socket, next) => {
  if (!socket.handshake.auth.token) return next(new Error('Token not found'))
  const decodedToken = decodeSocketToken(socket.handshake.auth.token)
  const { success, user } = await validateSocketToken(decodedToken)

  if (!success) return next(new Error('Token Invalid'))

  // Restrict MAX_CONNECTION_PER_USER
  if (!socketServer.sockets.adapter.rooms.get(user.uuid)) {
    socket.join(user.uuid)
  } else if (socketServer.sockets.adapter.rooms.get(user.uuid) && socketServer.sockets.adapter.rooms.get(user.uuid).size < MAX_CONNECTION_PER_USER) {
    socket.join(user.uuid)
  } else {
    return next(new Error('Already Connected'))
  }

  socket.user = user
  socket.user.socketId = socket.id

  next()
}

const socketServer = new SocketServer(socketServerOptions)

socketServer.adapter(createAdapter(redisClient.publisherClient, redisClient.subscriberClient))

socketServer.redisClient = redisClient.client

socketServer.encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), config.get('socket.encryptionKey')).toString()
}

socketServer.decryptData = (data) => {
  return JSON.parse(CryptoJS.AES.decrypt(data, config.get('socket.encryptionKey')).toString(CryptoJS.enc.Utf8))
}

socketServer.use(socketAuthentication)

socketServer.on('connection', async (socket, err) => {
  // Login user to get live login count in reports
  socket.on('login', async (msg) => {
    msg = socketServer.decryptData(msg)
    await liveLoginUser({ userId: socket.user.id, deviceType: msg.deviceType })
    Logger.info('Socket Login', { message: `userId : ${socket.user.id}` })
  })

  // When socket gets disconnect
  socket.on('disconnect', async () => {
    await liveLogoutUser({ userId: socket.user.id })
    Logger.info('Socket Logout', { message: `userId : ${socket.user.id}` })
  })
})

export default socketServer
