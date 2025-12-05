import { appConfig } from '@src/configs'
import basicAuth from 'express-basic-auth'

export const isBasicAuthenticatedMiddleware = basicAuth({
  users: { [appConfig.internal.basicAuth.username]: appConfig.internal.basicAuth.password },
  challenge: true
})
