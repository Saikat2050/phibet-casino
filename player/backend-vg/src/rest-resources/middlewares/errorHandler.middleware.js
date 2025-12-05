import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import { InternalServerErrorType } from '../../utils/constants/errors'
import { getLocalizedError, isTrustedError } from '../../utils/error.utils'
/**
 *
 * @memberof Rest Middleware
 * @export
 * @name errorHandlerMiddleware
 * @param {*} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function errorHandlerMiddleware (err, req, res, next) {
  let errorsAreTrusted = true
  let responseStatusCode
  const responseErrors = []

  if (!(err instanceof Array)) {
    err = [err]
  }

  const localizedInternalServerErrorType = getLocalizedError(InternalServerErrorType, res.__)

  if (err instanceof Array && !_.isEmpty(err)) {
    console.log(`[ERROR] API: ${req.method} ${req.originalUrl}`)
    console.log(`[ERROR] Message: ${err.message || err.description}`)
    err.forEach(error => {
      req?.context?.logger.error((error.name || InternalServerErrorType.name) + `In ${req.path}`, {
        message: error.message || error.description,
        context: {
          traceId: req?.context?.traceId,
          query: req.query,
          params: req.params,
          body: req.body
        },
        fault: error.fields
      })

      if (!isTrustedError(error)) {
        errorsAreTrusted = false
      }

      responseStatusCode = error.statusCode
      if (responseStatusCode === 403) {
        res.cookie('accessToken', '', { expires: new Date(0) })
      }

      // For device validation errors, use 400 instead of 403 to avoid frontend redirect
      if (error.name === 'GeolocationAccessDeniedError' || error.name === 'SecurityAccessDeniedError') {
        responseStatusCode = StatusCodes.BAD_REQUEST
      }

      const localizedError = getLocalizedError(error, res.__)

      responseErrors.push(localizedError)
    })
  } else {
    req?.context?.logger.error(err.name || InternalServerErrorType.name + `In ${req.path}`, {
      message: 'Empty errors array passed',
      context: { traceId: req?.context?.traceId }
    })
  }

  if (errorsAreTrusted) {
    res.status(responseStatusCode || StatusCodes.BAD_REQUEST).send({ data: {}, errors: responseErrors })
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      data: {},
      errors: [
        {
          traceId: req?.context?.traceId,
          ...localizedInternalServerErrorType
        }
      ]
    })
  }

  next()
}
