import * as jwt from 'jsonwebtoken'
import db from '../../../db/models'
import { plus, round } from 'number-precision'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { resetSocketLoginToken } from '../../../utils/common'
import { checkTournamentId } from '../../../helpers/tournament.helper'

export const userVerificationAndDetails = async (
  args = {},
  sequelizeTransaction
) => {
  const { sessionId, accountId, apiVersion } = args

  const findUser = await db.User.findOne({
    attributes: ['uniqueId', 'userId'],
    where: {
      userId: +sessionId.split('_')[1]
    },
    raw: true
  })

  if (!findUser) throw AUTH_FAILED(apiVersion)

  const jwtToken = await socketServer.redisClient.get(
    `gamePlay-${findUser.uniqueId}`
  )

  if (!jwtToken) throw AUTH_FAILED(apiVersion)

  const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

  if (!payload?.userId || !payload?.coin || !payload?.gameId) throw NOT_LOGGED_IN(apiVersion)

  const [userId, coin] = accountId.split('_')

  if (+payload.userId !== +userId || payload.coin !== coin) throw AUTH_FAILED(apiVersion)

  const isGameExist = await db.MasterCasinoGame.findOne({
    attributes: ['identifier', 'masterCasinoProviderId', 'masterCasinoGameId'],
    where: {
      masterCasinoGameId: payload.gameId
    },
    transaction: sequelizeTransaction
  })

  if (!isGameExist) throw OPT_NOT_ALLOWED(apiVersion)

  const userData = await db.User.findOne({
    attributes: ['userId', 'isActive', 'city', 'uniqueId'],
    where: {
      userId,
      isActive: true
    },
    include: [
      {
        model: db.Wallet,
        as: 'userWallet',
        attributes: [
          'walletId',
          'amount',
          'currencyCode',
          'ownerId',
          'gcCoin',
          'scCoin'
        ]
      }
    ],
    transaction: sequelizeTransaction
  })

  if (!userData) throw AUTH_FAILED(apiVersion)
  if (userData.isBan) throw AUTH_FAILED(apiVersion)

  const isScActive = coin === 'SC'

  const accountBalance = isScActive
    ? +scSum(userData.userWallet)
    : +round(+userData.userWallet.gcCoin, 2)

  await resetSocketLoginToken({ key: `user:${userData.uniqueId}` })

  return {
    userData,
    isScActive,
    currency: coin,
    accountBalance,
    coin,
    userId,
    isGameExist,
    tournamentId: await checkTournamentId(payload.tournamentId)
  }
}

export const scSum = userWallet => {
  return +round(
    +plus(
      +userWallet.scCoin.bsc,
      +userWallet.scCoin.wsc,
      +userWallet.scCoin.psc
    ),
    2
  )
}

export const TECHNICAL_ERROR = apiVersion => {
  return {
    code: 1,
    status: 'Technical error',
    message: 'Technical Error',
    apiVersion
  }
}

export const BET_NOT_FOUND = apiVersion => {
  return {
    code: 102,
    status: 'Wager not found',
    message: 'Wager Not Found',
    apiVersion
  }
}

export const OPT_NOT_ALLOWED = apiVersion => {
  return {
    code: 110,
    status: 'Operation not allowed',
    message: 'Operation not allowed',
    apiVersion
  }
}

export const OPERATOR_MISMATCH = apiVersion => {
  return {
    code: 400,
    status: 'Transaction operator mismatch',
    message: 'Transaction operator mismatch',
    apiVersion
  }
}

export const ROUND_CLOSED = apiVersion => {
  return {
    code: 409,
    status: 'Round closed or transaction ID exists',
    message: 'Round closed or transaction ID exists',
    apiVersion
  }
}

export const NOT_LOGGED_IN = apiVersion => {
  return {
    code: 1000,
    status: 'Not logged on',
    message: 'Not logged on',
    apiVersion
  }
}

export const AUTH_FAILED = apiVersion => {
  return {
    code: 1003,
    status: 'Authentication failed',
    message: 'Authentication Failed',
    apiVersion
  }
}

export const INSUFFICIENT_BALANCE = apiVersion => {
  return {
    code: 1006,
    status: 'Out of money',
    message: 'Out of money',
    apiVersion
  }
}

export const UNKNOWN_CURRENCY = apiVersion => {
  return {
    code: 1007,
    status: 'Unknown currency ',
    message: 'Unknown currency ',
    apiVersion
  }
}

export const REQUEST_PARAMETER_REQUIRED = apiVersion => {
  return {
    code: 1008,
    status: 'Parameter required',
    message: 'Parameter required',
    apiVersion
  }
}

export const BET_LIMIT_EXCEEDED = apiVersion => {
  return {
    code: 1019,
    status: 'Gaming limit',
    message: 'Overall bet limit exceeded',
    apiVersion
  }
}

export const BLOCKED_ACCOUNT = apiVersion => {
  return {
    code: 1035,
    status: 'Account Blocked',
    message: 'Account Blocked',
    apiVersion
  }
}

export const generateSessionToken = currentToken => {
  const time = new Date().valueOf()
  return `${currentToken}_${time}`
}

export const TRANSACTION_PARAMETER_MISMATCH = apiVersion => {
  return {
    code: 1035,
    status: 'Transaction parameter mismatch',
    message: 'Transaction parameter mismatch',
    apiVersion
  }
}
