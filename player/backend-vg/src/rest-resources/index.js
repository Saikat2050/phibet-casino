import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import i18n from '../libs/i18n'
import routes from '../rest-resources/routes'
import errorHandlerMiddleware from './middlewares/errorHandler.middleware'
import config from '../configs/app.config'
import { populateCache } from '../helpers/populatedCacheHelper'
// import { logTimeMiddleWare } from './middlewares/logTimeMiddleware'
// import session from 'express-session'
;(async () => {
  await populateCache()
})()
const app = express()

app.use(helmet())

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  })
)

app.use(cookieParser())

app.use(morgan('tiny'))

app.use(i18n.init)

// CORS Configuration
const corsOptions = {
  credentials: true,
  origin: config.get('origin').split(','),
  methods: ['GET, POST, PUT, PATCH, DELETE']
}

app.use(cors(corsOptions))
// app.use(logTimeMiddleWare)
app.use(routes)

app.use(async (req, res) => {
  console.log(req?.body, 'data =========')
  res.status(404).json({ status: 'Not Found' })
})

// has to be after routes
Sentry.setupExpressErrorHandler(app)

app.use(errorHandlerMiddleware)

export default app
