import { appConfig } from '@src/configs'
import { populateCache } from '@src/helpers/populateLocalCache.helper'
import '@src/libs/gracefulShutdown'
import { Logger } from '@src/libs/logger'
import apiLogModifierMiddleware from '@src/rest-resources/middlewares/apiLogModifier.middleware'
import { contextMiddleware } from '@src/rest-resources/middlewares/context.middleware'
import { errorHandlerMiddleware } from '@src/rest-resources/middlewares/errorHandler.middleware'
import { router } from '@src/rest-resources/routes'
import { socketServer } from '@src/socket-resources'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'

(async () => {
  await populateCache()
  const port = appConfig.port
  const app = express()

  app.use(cors({
    origin: appConfig.cors,
    credentials: true
  }))

  app.use(helmet())

  app.use(bodyParser.json({ limit: '1mb' }))

  app.use(morgan('tiny'))

  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(contextMiddleware)

  app.use(apiLogModifierMiddleware)
  app.use(router)

  app.use(errorHandlerMiddleware)

  const httpServer = createServer(app)

  socketServer.attach(httpServer)

  httpServer.listen({ port }, () => {
    Logger.info('Server', { message: `Listening on ${port}` })
  })
})()
