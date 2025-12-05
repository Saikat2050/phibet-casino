import { appConfig } from '@src/configs'
import '@src/libs/gracefulShutdown'
import { Logger } from '@src/libs/logger'
import { contextMiddleware } from '@src/rest-resources/middlewares/context.middleware'
import { router } from '@src/rest-resources/routes'
import { socketServer } from '@src/socket-resources'
import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import cors from 'cors'


(async () => {
  const port = appConfig.port
  const app = express()

  app.use(cors({
    origin: appConfig.cors,
    credentials: true
  }))

  app.use(helmet())

  app.use(bodyParser.json())

  app.use(morgan('tiny'))

  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(contextMiddleware)

  app.use(router)

  const httpServer = createServer(app)
  socketServer.attach(httpServer)

  httpServer.listen({ port }, () => {
    Logger.info('Server', { message: `Listening on ${port}` })
  })
})()
