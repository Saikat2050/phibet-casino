import { extractErrorAttributes } from '@src/utils'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'
import _ from 'lodash'

const errorTypeToResponseMapper = {
  NotEnoughAmountErrorType: ALEA_ERROR_TYPES.INSUFFICIENT_FUNDS
}

export const sendCasinoCallbackResponse = ({ req, res, next }, { success, result, errors }) => {
  if (success && !_.isEmpty(result)) {
    let statusCode = 200
    if (result?.statusCode !== 200 && result?.status) statusCode = result?.statusCode || 500

    res.payload = Object.assign({}, result)
    delete res.payload.statusCode
    res.status(statusCode).json({ ...res.payload })
  } else {
    if (!_.isEmpty(errors)) {
      const errorMessage = extractErrorAttributes(errors)[0]
      const error = errorTypeToResponseMapper[errorMessage] || ALEA_ERROR_TYPES.UNKNOWN_ERROR
      const statusCode = error.statusCode

      res.payload = Object.assign({}, error)
      delete res.payload.statusCode
      return res.status(statusCode).json({ ...res.payload })
    }
    res.status(200).json(ALEA_ERROR_TYPES.INTERNAL_ERROR)
  }
}

export const sendCasinoErrorResponse = ({ req, res, next }, { error }) => {
  if (error) {
    const { status, ...result } = error
    res.payload = result
    const statusCode = status ?? 200
    res.status(statusCode).json({ ...res.payload })
  } else {
    res.status(200).json(ALEA_ERROR_TYPES.INTERNAL_ERROR)
  }
}
