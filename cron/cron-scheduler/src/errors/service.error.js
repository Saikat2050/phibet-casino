import { errorTypes } from '@src/utils/constants/error.constants'
import { DatabaseError, EagerLoadingError, ValidationError } from 'sequelize'
import APIError from './api.error'
import BaseError from './base.error'

export default class ServiceError extends BaseError {
  constructor (message) {
    let fields = []
    const serviceErrorType = errorTypes.serviceErrorType

    if (message instanceof DatabaseError || message instanceof EagerLoadingError || message instanceof TypeError) {
      fields = message.message
      serviceErrorType.isOperational = false
    } else if (message instanceof ValidationError) {
      fields = message.errors
      serviceErrorType.description = message.message
      serviceErrorType.isOperational = false
    } else if (message instanceof APIError) {
      serviceErrorType.isOperational = false
    } else if (message instanceof Error) {
      serviceErrorType.description = message.description
      serviceErrorType.isOperational = true
    } else if (Array.isArray(message)) {
      fields = message
      serviceErrorType.isOperational = true
    } else {
      serviceErrorType.description = String(message)
      serviceErrorType.isOperational = true
    }

    super(serviceErrorType)
    this.fields = fields
  }
}
