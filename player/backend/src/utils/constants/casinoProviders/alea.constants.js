export const ALEA_PLAY_CASINO_TYPES = {
  BET: 'BET',
  WIN: 'WIN',
  BET_WIN: 'BET_WIN',
  ROLLBACK: 'ROLLBACK',
  BALANCE: 'BALANCE',
  END_ROUND: 'END_ROUND'
}

export const ALEA_ERROR_TYPES = {
  INVALID_SIGNATURE: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'Signature Incorrect'
  },
  SESSION_EXPIRED: {
    statusCode: 403,
    status: 'DENIED',
    code: 'SESSION_EXPIRED',
    message: 'Game Session Expired'
  },
  WIN_SESSION_EXPIRED: {
    statusCode: 500,
    status: 'DENIED',
    code: 'INVALID_REQUEST',
    message: 'Game Session Expired'
  },
  END_ROUND_ERROR: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'Unable to process the request'
  },
  ROLLBACK_SESSION_EXPIRED: {
    statusCode: 500,
    status: 'DENIED',
    code: 'INVALID_REQUEST',
    message: 'Game Session Expired'
  },
  BET_SESSION_EXPIRED: {
    statusCode: 403,
    status: 'DENIED',
    code: 'SESSION_EXPIRED',
    message: 'Game Session Expired'
  },
  PLAYER_BLOCKED: {
    statusCode: 403,
    status: 'ERROR',
    code: 'PLAYER_BLOCKED',
    message: 'Player is Blocked due to casino internal reason.'
  },
  BET_DENIED: {
    status: 'DENIED',
    statusCode: 403,
    code: 'BET_DENIED',
    message: 'This bet is denied due to casino internal reason.'
  },
  PLAYER_NOT_FOUND: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: "Player couldn't be found in casino's system."
  },
  INTERNAL_ERROR: {
    statusCode: 503,
    status: 'ERROR',
    code: 'GENERAL_ERROR',
    message: 'Please contact casino for this with the initial request.'
  },
  GAME_NOT_FOUND: {
    statusCode: 404,
    status: 'DENIED',
    code: 'GAME_NOT_ALLOWED',
    message: 'This game could not be found in the casino.'
  },
  WIN_GAME_NOT_FOUND: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'This game could not be found in the casino.'
  },
  BET_GAME_NOT_FOUND: {
    statusCode: 404,
    status: 'DENIED',
    code: 'GAME_NOT_ALLOWED',
    message: 'This bet game could not be found in the casino.'
  },
  ROLLBACK_GAME_NOT_FOUND: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'This rollback game could not be found in the casino.'
  },
  BET_MAX: {
    statusCode: 403,
    status: 'ERROR',
    code: 'BET_MAX',
    message: "Player's betting limit has exceeded."
  },
  DUPLICATE_TRANSACTION_DATA_MISMATCH: {
    statusCode: 400,
    status: 'ERROR',
    code: 'DUPLICATE_TRANSACTION_DATA_MISMATCH',
    message: 'Transaction found with data mismatch.'
  },
  INSUFFICIENT_FUNDS: {
    statusCode: 403,
    status: 'DENIED',
    code: 'INSUFFICIENT_FUNDS',
    message: "Player doesn't have sufficient balance to place a bet."
  },
  UNKNOWN_ERROR: {
    statusCode: 400,
    status: 'ERROR',
    code: 'UNKNOWN_ERROR',
    message: "Transaction has been declined due to casino's internal checks."
  },
  TRANSACTION_ALREADY_PROCESSED: {
    statusCode: 200,
    status: '',
    code: 'TRANSACTION_ALREADY_PROCESSED',
    isAlreadyProcessed: true,
    message: 'Provided Transaction has already been processed before.'
  },
  TRANSACTION_NOT_FOUND: {
    statusCode: 404,
    status: 'ERROR',
    code: 'TRANSACTION_NOT_FOUND',
    message: 'Casino could not find transaction, hence cannot be processed ahead.'
  },
  INVALID_CURRENCY: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'Request Made with invalid currency.'
  }
}
