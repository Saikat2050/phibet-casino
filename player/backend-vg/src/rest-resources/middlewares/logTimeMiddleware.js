import db from '../../db/models'
import { getClientIp } from 'request-ip'

export async function logTimeMiddleWare (req, res, next) {
  if (req?.route?.path === '/health-check') next()
  const startTime = new Date()

  res.on('finish', () => {
    const endedAt = new Date()
    delete req?.body?.id
    delete req?.body?.user
    delete req?.body.uniqueId

    const data = {
      userId: req?.userId,
      originalUrl: req.originalUrl,
      route: req?.route?.path,
      startedAt: startTime,
      endedAt: endedAt,
      duration: endedAt - startTime,
      statusCode: res.statusCode,
      params: req.params,
      query: req.query,
      body: req.body,
      bodyType: determineContentType(req.get('Content-Type')),
      headers: req?.headers,
      ipAddress: getClientIp(req),
      referrer: req.get('Referrer'),
      userAgent: req.get('User-Agent'),
      response: res?.payload
    }
    db.ServerLog.create(data).catch(err => {
      console.error('Failed to log request:', err)
    })
  })

  next()
}

function determineContentType (contentType) {
  if (!contentType) return 'unknown'

  if (contentType.includes('application/json')) {
    return 'raw (JSON)'
  } else if (contentType.includes('multipart/form-data')) {
    return 'form-data'
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    return 'form-urlencoded'
  } else if (contentType.includes('application/graphql')) {
    return 'GraphQL'
  } else if (contentType.includes('text/plain')) {
    return 'raw (Text)'
  } else {
    return 'unknown' // If none of the known content types match
  }
}
