export const ICONIC21_ERROR_TYPES = {
  PLAYER_NOT_FOUND: {
    statusCode: 422,
    status: 'ERROR',
    code: 'player.not.found',
    message: 'Player is not found'
  },
  GAME_NOT_FOUND: {
    statusCode: 422,
    status: 'DENIED',
    code: 'unknown.game',
    message: 'Launch alias not found.'
  },
  INTERNAL_ERROR: {
    statusCode: 503,
    status: 'ERROR',
    code: 'error.internal',
    message: 'Internal error.'
  },
  BAD_REQUEST: {
    statusCode: 422,
    status: 'ERROR',
    code: 'bad.request',
    message: 'Amount is less than 0'
  },
  INVALID_SIGNATURE: {
    statusCode: 403,
    status: 'ERROR',
    code: 'invalid.signature',
    message: 'Signature Incorrect'
  },
  SESSION_EXPIRED: {
    statusCode: 422,
    status: 'DENIED',
    code: 'invalid.session.key',
    message: 'Session key is invalid or expired'
  },
  TRANSACTION_ALREADY_PROCESSED: {
    statusCode: 200,
    status: 'ERROR',
    code: 'transaction.already.processed',
    message: 'Provided Transaction has already been processed before'
  },
  INSUFFICIENT_FUNDS: {
    statusCode: 422,
    status: 'DENIED',
    code: 'insufficient.balance',
    message: 'Insufficient player balance.'
  },
  INVALID_BEHAVIOUR: {
    statusCode: 422,
    status: 'DENIED',
    code: 'invalid.casino.behaviour',
    message: 'Unexpected casino logic behaviour.'
  },
  INVALID_TRANSACTION_ID: {
    statusCode: 422,
    status: 'DENIED',
    code: 'invalid.transaction.id',
    message: 'Unexpected transaction id.'
  }
}
