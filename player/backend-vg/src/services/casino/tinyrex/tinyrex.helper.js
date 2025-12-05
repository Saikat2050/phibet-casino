import crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import db from '../../../db/models'
import { plus } from 'number-precision'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { resetSocketLoginToken } from '../../../utils/common'
import { checkTournamentId } from '../../../helpers/tournament.helper'
import { CACHE_KEYS } from '../../../utils/constants/constant'
import { minus, round } from 'number-precision'

export const verifySignature = args => {
  const { signature, rawBody } = args
  const sign = crypto.createHash('sha256').update(`${config.get('beterLive.secret_key')}${rawBody}`).digest('hex')
  if (signature !== sign){
    return false
  }else{
    return true
  }
}

export const userDetailsAndVerification = async (
  args = {},
  sequelizeTransaction
) => {
  const { playerId, sessionToken: sessionId, launchAlias: identifier } = args

  sequelizeTransaction = sequelizeTransaction ? { transaction: sequelizeTransaction } : {}

  if (!verifySignature(args)) throw INVALID_SIGNATURE

  const jwtToken = await socketServer.redisClient.get(
    `gamePlay-${sessionId.split('_')[0]}`
  )

  if (!jwtToken) throw SESSION_EXPIRED

  const payload = jwt.verify(jwtToken, config.get('jwt.casinoGamePlaySecret'))

  if (!payload?.userId || !payload?.coin || !payload?.gameId) throw SESSION_EXPIRED

  const [userId, coin] = playerId.split('_')

  if (+payload.userId !== +userId || payload.coin !== coin) throw PLAYER_NOT_FOUND
  let isGameExist

  const gamesCache = await socketServer.redisClient.get(CACHE_KEYS.GAMES)
  const parsedGames = JSON.parse(gamesCache || '[]')
  if (parsedGames.length) {
    const isGameExist = parsedGames.find(game => game.identifier === identifier + '')
    if (!isGameExist) throw UNKNOWN_GAME
  } else {
    isGameExist = await db.MasterCasinoGame.findOne({
      attributes: ['identifier', 'masterCasinoProviderId', 'masterCasinoGameId'],
      where: {
        identifier: identifier + ''
      },
      ...sequelizeTransaction
    })

    if (!isGameExist) throw UNKNOWN_GAME
  }

  const userData = await db.User.findOne({
    attributes: [
      'userId',
      'isActive',
      'city',
      'uniqueId',
      'username',
      'firstName',
      'lastName',
      'currencyCode',
      'countryCode'
    ],
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
    ...sequelizeTransaction
  })
  const countryCode = userData.countryCode
    ? (await db.Country.findOne({
        where: { countryId: userData.countryCode },
        raw: true
      }).code) ?? 'US'
    : 'US'
  if (!userData) throw PLAYER_NOT_FOUND
  if (userData.isBan) throw PLAYER_NOT_FOUND

  const isScActive = coin === 'SC'

  const accountBalance = isScActive
    ? scSum(userData.userWallet)
    : +(+userData.userWallet.gcCoin.toFixed(2))

  await resetSocketLoginToken({ key: `user:${userData.uniqueId}` })

  return {
    userData,
    isScActive,
    currency: userData.currencyCode ? userData.currencyCode : 'USD',
    accountBalance,
    coin,
    userId,
    isGameExist,
    countryCode,
    identifier,
    tournamentId: await checkTournamentId(payload.tournamentId)
  }
}

export const scSum = userWallet => {
  return +plus(
    +userWallet.scCoin.bsc,
    +userWallet.scCoin.wsc,
    +userWallet.scCoin.psc
  ).toFixed(2)
}

export const userDetailsAndVerificationWithoutSession = async (
  args = {},
  sequelizeTransaction
) => {
  const {
    playerId,
    launchAlias: identifier
  } = args

  if (!verifySignature(args)) throw INVALID_SIGNATURE

  sequelizeTransaction = sequelizeTransaction ? { transaction: sequelizeTransaction } : ''

  const [userId, coin] = playerId.split('_')

  if (!(+userId) || +userId <= 0) throw PLAYER_NOT_FOUND

  const isGameExist = await db.MasterCasinoGame.findOne({
    attributes: ['identifier', 'masterCasinoProviderId', 'masterCasinoGameId'],
    where: {
      identifier: identifier + ''
    },
    ...sequelizeTransaction
  })

  if (!isGameExist) throw UNKNOWN_GAME

  const userData = await db.User.findOne({
    attributes: [
      'userId',
      'isActive',
      'city',
      'uniqueId',
      'username',
      'firstName',
      'lastName',
      'currencyCode',
      'countryCode'
    ],
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
    ...sequelizeTransaction
  })

  if (!userData) throw PLAYER_NOT_FOUND
  if (userData.isBan) throw PLAYER_NOT_FOUND

  const countryCode = userData.countryCode
    ? (await db.Country.findOne({
        where: { countryId: userData.countryCode },
        raw: true
      }).code) ?? 'US'
    : 'US'

  const isScActive = coin === 'SC'
  const accountBalance = isScActive
    ? scSum(userData.userWallet)
    : +(+userData.userWallet.gcCoin.toFixed(2))

  return {
    userData,
    isScActive,
    currency: userData.currencyCode ? userData.currencyCode : 'USD',
    accountBalance,
    coin,
    userId,
    isGameExist,
    countryCode,
    identifier
  }
}

export const betSC = ({userWallet, betAmount, balance}) => {
  const moreDetails = { bsc: 0, psc: 0, wsc: 0 }
  let remainingBetAmount = 0
  const totalScCoin = +balance
  if (+userWallet.scCoin.bsc >= +betAmount) {
    userWallet.scCoin = {
      ...userWallet.scCoin,
      bsc: +round(+minus(+userWallet.scCoin.bsc, +betAmount), 2)
    }
    moreDetails.bsc = +betAmount
  } 
  else {
    moreDetails.bsc = +userWallet.scCoin.bsc
    remainingBetAmount = +round(+minus(+betAmount, +userWallet.scCoin.bsc), 2)
    userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }
    if (+userWallet.scCoin.psc >= +remainingBetAmount) {
      userWallet.scCoin = {
        ...userWallet.scCoin,
        psc: +round(+minus(+userWallet.scCoin.psc, +remainingBetAmount), 2)
      }
      moreDetails.psc = +remainingBetAmount
    } else {
      moreDetails.psc = +userWallet.scCoin.psc
      remainingBetAmount = +round(+minus(+remainingBetAmount, +userWallet.scCoin.psc), 2)
      userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }
      if (+remainingBetAmount > +userWallet.scCoin.wsc) return 'IN_SUFFICIENT_BALANCE'
      userWallet.scCoin = { ...userWallet.scCoin, wsc: +round(+minus(+userWallet.scCoin.wsc, +remainingBetAmount), 2) }
      moreDetails.wsc = +remainingBetAmount
    }
  }
  const beforeBalance = +round(+totalScCoin, 2)
  const afterBalance = +round(+minus(totalScCoin, +betAmount), 2)
  console.log({
    beforeBalance: beforeBalance,
    afterBalance: afterBalance,
    moreDetails: moreDetails
  })
  return { beforeBalance, afterBalance, moreDetails }
}

export const SESSION_EXPIRED = {
  status: 422,
  statusCode: 422,
  code: 'invalid.session.key',
  message: 'Session key is invalid or expired'
}
export const PLAYER_NOT_FOUND = {
  status: 422,
  statusCode: 422,
  code: 'player.not.found',
  message: 'Player is not found'
}
export const INSUFFICIENT_BALANCE = {
  status: 422,
  statusCode: 422,
  code: 'insufficient.balance',
  message: 'Insufficient player balance'
}
export const INVALID_TRANSACTION_ID = {
  status: 422,
  statusCode: 422,
  code: 'invalid.transaction.id',
  message: 'Unexpected transaction id'
}
export const INVALID_CASINO_BEHAVIOR = {
  status: 422,
  statusCode: 422,
  code: 'invalid.casino.behaviour',
  message: 'Unexpected casino logic behavior'
}
export const INTERNAL_ERROR = {
  status: 422,
  statusCode: 422,
  code: 'error.internal',
  message: 'Internal error' 
}
export const BAD_REQUEST = {
  status: 422,
  statusCode: 422,
  code: 'bad.request',
  message: 'Amount is less than 0'
}
export const UNKNOWN_GAME = {
  status: 422,
  statusCode: 422,
  code: 'unknown.game',
  message: 'Launch alias not found'
}
export const BET_MAX = {
  status: 422,
  statusCode: 422,
  code: 'bet.max.exceed',
  message: "Player's betting limit has exceeded"
}
export const TRANSACTION_ALREADY_PROCESSED = {
  status: 200,
  statusCode: 200,
  code: 'transaction.already.processed',
  message: 'Provided Transaction has already been processed before'
}
export const TRANSACTION_NOT_FOUND = {
  status: 422,
  statusCode: 422,
  code: 'transaction.not.found',
  message: 'Casino could not find transaction, hence cannot be processed ahead'
}
export const BET_DENIED = {
  status: 422,
  statusCode: 422,
  code: 'bet.denied',
  message: 'This bet is denied due to casino internal reason'
}
export const UNKNOWN_ERROR = {
  status: 422,
  statusCode: 422,
  code: 'unknown.error',
  message: "Transaction has been declined due to casino's internal checks"
}
export const INVALID_SIGNATURE = {
  status: 403,
  statusCode: 403,
  code: 'invalid.signature',
  message: 'Signature Incorrect'
}

export const generateSessionToken = currentToken => {
  const time = new Date().valueOf()
  return `${currentToken}_${time}`
}

export const generateHash = obj => {
  const str = `${config.get('beterLive.secret_key')}${JSON.stringify(obj)}`
  return `${crypto.createHash('sha256').update(str).digest('hex')}`
}
