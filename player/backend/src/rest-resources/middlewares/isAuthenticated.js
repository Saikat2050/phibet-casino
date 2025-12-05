import AuthenticationError from '@src/errors/authentication.error'
import { CheckAndUpdateAllLimits } from '@src/services/responsibleGambling/checkAndUpdateAllLimits.service'
import { COOKIE_KEYS } from '@src/utils/constants/app.constants'
import { errorTypes } from '@src/utils/constants/error.constants'
import BaseError from '@src/errors/base.error'

/**
 * @type {import('express').RequestHandler}
 */
export async function isAuthenticated (req, _, next) {
  try {
    const sessionId = req.headers?.authorization?.substring(`${COOKIE_KEYS.ACCESS_TOKEN}=`.length) || req.headers?.cookie?.split(`${COOKIE_KEYS.ACCESS_TOKEN}=`)[1] || ''
    req.sessionStore.get(sessionId, async (error, session) => {
      if (error) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))
      if (!session?.userId) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      req.sessionID = sessionId
      const result = await CheckAndUpdateAllLimits.execute({ userId: session.userId }, req.context)
      if (!result.success) return next(new BaseError({ ...errorTypes.SelfExcludedErrorType }))

      req.authenticated = { userId: session.userId }
      next()
    })
  } catch (error) {
    next(error)
  }
}
