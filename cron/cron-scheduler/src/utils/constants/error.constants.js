import { StatusCodes } from 'http-status-codes'

export const messages = {
  INVALID_REQUEST: 'Request not validated',
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  INVALID_AGGREGATOR_TYPE: 'INVALID_AGGREGATOR_TYPE',
  USER_DOES_NOT_EXISTS: 'USER_DOES_NOT_EXISTS',
  USER_INACTIVE: 'USER_INACTIVE',
  INVALID_VALUE: 'INVALID_VALUE',
  INVALID_WALLET_ID: 'INVALID_WALLET_ID',
  NOT_ENOUGH_AMOUNT: 'NOT_ENOUGH_AMOUNT',
  ACCESS_TOKEN_NOT_FOUND: 'ACCESS_TOKEN_NOT_FOUND',
  INVALID_TOKEN: 'INVALID_TOKEN',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PLEASE_CHECK_REQUEST_DATA: 'PLEASE_CHECK_REQUEST_DATA',
  RESPONSE_VALIDATION_FAILED: 'RESPONSE_VALIDATION_FAILED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SOCKET_PROVIDE_PROPER_ARGUMENTS: 'SOCKET_PROVIDE_PROPER_ARGUMENTS',
  ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED: 'ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED',
  USER_BONUS_NOT_EXIST: 'USER_BONUS_NOT_EXIST',
  WITHDRAWL_NOT_EXIST: 'WITHDRAWL_NOT_EXIST',
  TRANSACTION_NOT_EXIST: 'TRANSACTION_NOT_EXIST',
  JACKPOT_NOT_FOUND: 'JACKPOT_NOT_FOUND'
}

export const errorTypes = {
  RequestInputValidationErrorType: {
    name: 'RequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3001
  },
  ResponseValidationErrorType: {
    name: 'ResponseInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.RESPONSE_VALIDATION_FAILED,
    errorCode: 3002
  },
  SocketRequestInputValidationErrorType: {
    name: 'SocketRequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3003
  },
  SocketResponseValidationErrorType: {
    name: 'SocketResponseValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.RESPONSE_VALIDATION_FAILED,
    errorCode: 3004
  },
  InternalServerErrorType: {
    name: 'InternalServerError',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: true,
    description: messages.INTERNAL_SERVER_ERROR,
    errorCode: 3005
  },
  InvalidSocketArgumentErrorType: {
    name: 'InvalidSocketArgumentError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SOCKET_PROVIDE_PROPER_ARGUMENTS,
    errorCode: 3006
  },
  AuthenticationErrorType: {
    name: 'AuthenticationErrorType',
    statusCode: StatusCodes.UNAUTHORIZED,
    isOperational: true,
    description: messages.ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED,
    errorCode: 3007
  },
  UserDoesNotExistsErrorType: {
    name: 'UserDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_DOES_NOT_EXISTS,
    errorCode: 3008
  },
  NotEnoughAmountErrorType: {
    name: 'NotEnoughAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOT_ENOUGH_AMOUNT,
    errorCode: 3025
  },
  InvalidWalletIdErrorType: {
    name: 'InvalidWalletIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_WALLET_ID,
    errorCode: 3024
  },
  AccessTokenNotFoundErrorType: {
    name: 'AccessTokenNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ACCESS_TOKEN_NOT_FOUND,
    errorCode: 3026
  },
  InvalidAggregatorType: {
    name: 'InvalidAggregatorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_AGGREGATOR_TYPE,
    errorCode: 3027
  },
  UserBonusDoesNotExist: {
    name: 'UserBonusDoesNotExist',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_BONUS_NOT_EXIST,
    errorCode: 3028
  },
  WithdrawlNotExistErrorType: {
    name: 'WithdrawlNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WITHDRAWL_NOT_EXIST,
    errorCode: 3029
  },
  TransactionNotExistErrorType: {
    name: 'TransactionNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TRANSACTION_NOT_EXIST,
    errorCode: 3030
  },
  JackpotNotFoundErrorType: {
    name: 'JackpotNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.JACKPOT_NOT_FOUND,
    errorCode: 3031
  },
}
