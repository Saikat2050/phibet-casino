import is from 'request-ip/lib/is'
import { getClientIpFromXForwardedFor } from 'request-ip/lib'
export * from './error.utils'

/**
 * @param {import('express').Request} request
 * @returns {string} ipAddress of the request
 */

export const getIp = req => {
  if (req.headers) {
    if (is.ip(req.headers['user-ip'])) {
      return req.headers['user-ip']
    }
    if (is.ip(req.headers['x-client-ip'])) {
      return req.headers['x-client-ip']
    }

    if (is.ip(req.headers['cf-connecting-ip'])) {
      return req.headers['cf-connecting-ip']
    }

    if (is.ip(req.headers['fastly-client-ip'])) {
      return req.headers['fastly-client-ip']
    }

    if (is.ip(req.headers['true-client-ip'])) {
      return req.headers['true-client-ip']
    }

    if (is.ip(req.headers['x-real-ip'])) {
      return req.headers['x-real-ip']
    }

    if (is.ip(req.headers['x-cluster-client-ip'])) {
      return req.headers['x-cluster-client-ip']
    }

    if (is.ip(req.headers['x-forwarded'])) {
      return req.headers['x-forwarded']
    }

    const xForwardedFor = getClientIpFromXForwardedFor(
      req.headers['x-forwarded-for']
    )

    if (is.ip(xForwardedFor)) {
      return xForwardedFor
    }

    if (is.ip(req.headers['forwarded-for'])) {
      return req.headers['forwarded-for']
    }

    if (is.ip(req.headers.forwarded)) {
      return req.headers.forwarded
    }

    if (is.ip(req.headers['x-appengine-user-ip'])) {
      return req.headers['x-appengine-user-ip']
    }
  }

  if (is.existy(req.connection)) {
    if (is.ip(req.connection.remoteAddress)) {
      return req.connection.remoteAddress
    }

    if (
      is.existy(req.connection.socket) &&
      is.ip(req.connection.socket.remoteAddress)
    ) {
      return req.connection.socket.remoteAddress
    }
  }

  if (is.existy(req.socket) && is.ip(req.socket.remoteAddress)) {
    return req.socket.remoteAddress
  }

  if (is.existy(req.info) && is.ip(req.info.remoteAddress)) {
    return req.info.remoteAddress
  }

  if (
    is.existy(req.requestContext) &&
    is.existy(req.requestContext.identity) &&
    is.ip(req.requestContext.identity.sourceIp)
  ) {
    return req.requestContext.identity.sourceIp
  }

  if (req.headers) {
    if (is.ip(req.headers['Cf-Pseudo-IPv4'])) {
      return req.headers['Cf-Pseudo-IPv4']
    }
  }

  if (is.existy(req.raw)) {
    return getIp(req.raw)
  }

  return null
}
