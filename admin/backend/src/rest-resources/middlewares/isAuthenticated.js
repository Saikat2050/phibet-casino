import { appConfig } from '@src/configs'
import AuthenticationError from '@src/errors/authentication.error'
// import { Cache } from '@src/libs/cache'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { errorTypes } from '@src/utils/constants/error.constants'
import Jwt from 'jsonwebtoken'

/**
 * @param {string} permission
 * @returns {import('express').RequestHandler}
 */
export function isAuthenticated (permission) {
  const [resource, permissionLevel] = permission?.split(':') || [null, null]
  return async function (req, _, next) {
    try {
      const accessToken = req.headers.authorization?.split('Bearer ')[1]
      if (!accessToken) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      const decodedToken = Jwt.verify(accessToken, appConfig.jwt.secret)
      if (decodedToken.type !== JWT_TOKEN_TYPES.LOGIN) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      // check jwt token in redis against the accessToken
      // const tokenObject = await Cache.get(`admin:${decodedToken.adminUserId}`)
      // if(!tokenObject || tokenObject.token!==accessToken) return next(new AuthenticationError(errorTypes.AuthenticationErrorType))

      if (permission && !decodedToken?.permissions[resource]?.includes(permissionLevel)) return next(new AuthenticationError(errorTypes.NotEnoughPermissionErrorType))

      req.authenticated = {
        adminUserId: decodedToken.adminUserId,
        adminUserName: decodedToken?.adminUserName,
        adminEmail: decodedToken?.adminEmail
      }
      next()
    } catch (error) {
      next(new AuthenticationError(error))
    }
  }
}
