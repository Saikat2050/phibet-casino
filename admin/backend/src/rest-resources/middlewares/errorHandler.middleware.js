import { errorTypes } from '@src/utils/constants/error.constants'
import { getLocalizedError, isTrustedError } from '@src/utils/error.utils'
import { StatusCodes } from 'http-status-codes'
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
export function errorHandlerMiddleware (err, req, res, next) {
  let errorsAreTrusted = true
  let responseStatusCode
  let responseTimeInMs = -1
  let errorResponse = ''

  if (!(err instanceof Array)) {
    err = [err]
  }
  const localizedInternalServerErrorType = getLocalizedError(
    errorTypes.InternalServerErrorType,
    res.__
  )

  const responseErrors = err.map((error) => {
    req?.context?.logger.error(
      (error.name || errorTypes.InternalServerErrorType.name) +
        `In ${req.path}`,
      {
        message: error.message || error.description || 'No message provided',
        context: {
          traceId: req?.context?.traceId,
          query: req.query,
          params: req.params,
          body: req.body
        },
        fault: error.fields
      }
    )
    errorsAreTrusted = isTrustedError(error)

    responseStatusCode = error.statusCode
    if (errorResponse !== '') {
      errorResponse = `${errorResponse}, ${error.message || error.description}`
    } else {
      errorResponse = error.message || error.description
    }

    const localizedError = getLocalizedError(error, res.__)

    return localizedError
  })

  res.on('finish', () => {
    const diff = process.hrtime(req._startTime)
    responseTimeInMs = diff[0] * 1e3 + diff[1] / 1e6
  })

  if (errorsAreTrusted) {
    const apiLogsData = {
      ...req.api_log_data,
      statusCode: responseStatusCode || StatusCodes.BAD_REQUEST,
      responseTime: `${responseTimeInMs.toFixed(2)} ms`,
      response: responseErrors,
      errorResponse
    }

    // Async API Logs entry
    req.context.models.apiLog.create(apiLogsData)

    res
      .status(responseStatusCode || StatusCodes.BAD_REQUEST)
      .send({ data: {}, errors: responseErrors })
  } else {
    const apiLogsData = {
      ...req.api_log_data,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      responseTime: `${responseTimeInMs.toFixed(2)} ms`,
      response: [
        {
          traceId: req?.context?.traceId,
          ...localizedInternalServerErrorType
        }
      ],
      errorResponse: 'Something went wrong'
    }

    // Async API Logs entry
    req.context.models.apiLog.create(apiLogsData)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      data: {},
      errors: [
        {
          ...localizedInternalServerErrorType,
          traceId: req?.context?.traceId
        }
      ]
    })
  }
  next()
}
