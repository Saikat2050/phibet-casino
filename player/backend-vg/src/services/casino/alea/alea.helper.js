import crypto from 'crypto'
import { plus, round } from 'number-precision'
import config from '../../../configs/app.config'

export const verifySignature = args => {
  let str
  const { signature, stringData, ...request } = args
  if (request.type === 'BALANCE') {
    const { casinoSessionId, currency, gameId, integratorId, softwareId } =
      request
    str = `${casinoSessionId}${currency}${gameId}${integratorId}${softwareId}${config.get(
      'alea.secret_key'
    )}`
  } else {
    str = `${stringData}${config.get('alea.secret_key')}`
  }
  const sign = `SHA-512=${crypto
    .createHash('sha512')
    .update(str)
    .digest('hex')}`

  if (sign !== signature) return false
  return true
}

export const scSum = userWallet => {
  return +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2)
}

export const INVALID_SIGNATURE = {
  statusCode: 500,
  status: 'ERROR',
  code: 'INVALID_REQUEST',
  message: 'Signature Incorrect'
}

export const SESSION_EXPIRED = {
  statusCode: 403,
  status: 'DENIED',
  code: 'SESSION_EXPIRED',
  message: 'Game Session Expired'
}

export const WIN_SESSION_EXPIRED = {
  statusCode: 500,
  status: 'DENIED',
  code: 'INVALID_REQUEST',
  message: 'Game Session Expired'
}

export const ROLLBACK_SESSION_EXPIRED = {
  statusCode: 500,
  status: 'DENIED',
  code: 'INVALID_REQUEST',
  message: 'Game Session Expired'
}

export const BET_SESSION_EXPIRED = {
  statusCode: 403,
  status: 'DENIED',
  code: 'SESSION_EXPIRED',
  message: 'Game Session Expired'
}

export const PLAYER_BLOCKED = {
  statusCode: 403,
  code: 'PLAYER_BLOCKED',
  message: 'Player is Blocked due to casino internal reason.'
}

export const BET_DENIED = {
  status: 'DENIED',
  statusCode: 403,
  code: 'BET_DENIED',
  message: 'This bet is denied due to casino internal reason.'
}

export const PLAYER_NOT_FOUND = {
  status: 'ERROR',
  code: 'INVALID_REQUEST',
  message: "Player couldn't be found in casino's system."
}

export const INTERNAL_ERROR = {
  statusCode: 503,
  status: 'ERROR',
  code: 'GENERAL_ERROR',
  message: 'Please contact casino for this with the initial request.'
}

export const GAME_NOT_FOUND = {
  statusCode: 403,
  status: 'ERROR',
  code: 'INVALID_REQUEST',
  message: 'This game could not be found in the casino.'
}

export const BET_GAME_NOT_FOUND = {
  statusCode: 403,
  status: 'ERROR',
  code: 'INVALID_REQUEST',
  message: 'This bet game could not be found in the casino.'
}

export const ROLLBACK_GAME_NOT_FOUND = {
  statusCode: 500,
  status: 'ERROR',
  code: 'INVALID_REQUEST',
  message: 'This rollback game could not be found in the casino.'
}

export const BET_MAX = {
  status: 403,
  code: 'BET_MAX',
  message: "Player's betting limit has exceeded."
}

export const DUPLICATE_TRANSACTION_DATA_MISMATCH = {
  status: 400,
  code: 'DUPLICATE_TRANSACTION_DATA_MISMATCH',
  message: 'Transaction found with data mismatch.'
}

export const INSUFFICIENT_FUNDS = {
  statusCode: 403,
  status: 'DENIED',
  code: 'INSUFFICIENT_FUNDS',
  message: "Player doesn't have sufficient balance to place a bet."
}

export const UNKNOWN_ERROR = {
  status: 400,
  code: 'UNKNOWN_ERROR',
  message: "Transaction has been declined due to casino's internal checks."
}

export const TRANSACTION_ALREADY_PROCESSED = {
  statusCode: 200,
  code: 'TRANSACTION_ALREADY_PROCESSED',
  isAlreadyProcessed: true,
  message: 'Provided Transaction has already been processed before.'
}

export const TRANSACTION_NOT_FOUND = {
  status: 404,
  code: 'TRANSACTION_NOT_FOUND',
  message: 'Casino could not find transaction, hence cannot be processed ahead.'
}

export const INVALID_CURRENCY = {
  status: 'ERROR',
  code: 'INVALID_REQUEST',
  message: 'Request Made with invalid currency.'
}
