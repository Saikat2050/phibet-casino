import { errorTypes } from '@src/utils/constants/error.constants'
import BaseError from './base.error'

export default class ResponseValidationError extends BaseError {
  constructor (fields = {}) {
    super(errorTypes.responseValidationErrorType)
    this.fields = fields
  }
}
