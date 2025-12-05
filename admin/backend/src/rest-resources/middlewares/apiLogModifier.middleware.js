import moment from 'moment'

export default function apiLogModifierMiddleware (req, res, next) {
  req._startTime = process.hrtime() // Start the timer
  let requestType = 'BODY'

  // Check Request type
  if (req.body && Object.keys(req.body).length) {
    requestType = 'BODY'
  } else if (req.query && Object.keys(req.query).length) {
    requestType = 'QUERY'
  } else if (req.params && Object.keys(req.params).length) {
    requestType = 'PARAMS'
  } else if (req.files || req.file) {
    requestType = 'FILE'
  } else {
    requestType = 'NONE'
  }

  const apiLogData = {}
  apiLogData.request = { ...req.body, ...req.query, ...req.params }
  apiLogData.instance = 'SWEEP-ADMIN-BE'
  apiLogData.endpoint = `${req.method || 'GET'} ${req.originalUrl || req.path}`
  apiLogData.timestamp = moment().format('DD-MM-YYYY HH:mm:ss')
  apiLogData.responseTime = '-1'
  apiLogData.statusCode = 200
  apiLogData.requestType = requestType
  // apiLogData.modeDetails = req

  req.api_log_data = apiLogData
  return next()
}
