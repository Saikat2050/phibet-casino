import _ from 'lodash'
import BaseError from '../errors/base.error'
import * as errorTypes from './constants/errors'
import { extractErrorAttributes } from './error.utils'
import config from '../configs/app.config'

export const sendResponse = ({ req, res, next }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    res.payload = { data: result, errors: [] }
    next()
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(([errorAttr, details]) => ({ ...(errorTypes[errorAttr] || { errorAttr }), details }))
      return next(responseErrors)
    }
    const responseError = new BaseError({ ...defaultError })
    next(responseError)
  }
}

export const sendAccessTokenResponse = ({ req, res, next }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    if (config.get('env') === 'development') {
      res.setHeader('accessToken', result?.user?.accessToken)
    } else {
      res.setHeader('accessToken', result?.user?.accessToken)
    }
    delete result?.user?.accessToken
    res.payload = { data: result, errors: [] }
    next()
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(([errorAttr, details]) => ({ ...(errorTypes[errorAttr] || { errorAttr }), details }))
      return next(responseErrors)
    }
    const responseError = new BaseError({ ...defaultError })
    next(responseError)
  }
}

export const sendSocketResponse = ({ reqData, resCallback }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    return resCallback({ data: result, errors: [] })
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(errorAttr => errorTypes[errorAttr] || errorAttr)
      return resCallback({ data: {}, errors: responseErrors })
    }
    const responseError = new BaseError({ ...defaultError })
    return resCallback({ data: {}, errors: [responseError] })
  }
}
