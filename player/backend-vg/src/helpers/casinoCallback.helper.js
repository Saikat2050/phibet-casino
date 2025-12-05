import _ from 'lodash'
import { CASINO_DEFAULT_ERROR } from '../utils/constants/constant'

export const sendCasinoCallbackResponse = ({ req, res, next }, { successful, result }) => {
  if (successful && !_.isEmpty(result)) {
    let statusCode = 200
    if ((result?.status && result?.status !== 200) || (result?.status && result?.statusCode !== 200)) {
      statusCode = result?.statusCode || result?.status || 500
    }
    delete result?.statusCode
    res.status(statusCode).json({ ...result })
  } else {
    res.status(200).json(CASINO_DEFAULT_ERROR)
  }
}

export const sendCasinoErrorResponse = ({ req, res, next }, { error }) => {
  if (error) {
    const { status, ...result } = error
    res.payload = result
    const statusCode = status ?? 200
    res.status(statusCode).json({ ...res.payload })
  } else {
    res.status(200).json(CASINO_DEFAULT_ERROR)
  }
}

export const sendBoomingCasinoCallbackResponse = ({ req, res, next }, { successful, result }) => {
  if (successful && !_.isEmpty(result)) {
    res.payload = result
    const statusCode = 200
    res.status(statusCode).send(res.payload)
  } else {
    res.status(200).json(CASINO_DEFAULT_ERROR)
  }
}
