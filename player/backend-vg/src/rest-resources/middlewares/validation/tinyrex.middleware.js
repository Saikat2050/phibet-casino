import db from '../../../db/models'
import { NumberPrecision } from '../../../libs/numberPrecision'
import { decryptData, encryptData } from '../../../utils/common'

export default function tinyrexAuthMiddleware () {
  return async (req, res, next) => {
    try {
      const { sessionToken: token, playerId } = req.body

      const detail = await db.User.findOne({
        attributes: ['uniqueId', 'username', 'userId'],
        where: { userId: playerId },
        include: [
          {
            model: db.Wallet,
            as: 'userWallet',
            attributes: ['walletId', 'ownerId', 'gcCoin', 'scCoin']
          }
        ]
      })

      if (!detail) {
        return {
          status: 422,
          statusCode: 422,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      if (!token) {
        return {
          status: 400,
          statusCode: 400,
          code: 'token.not.found',
          message: 'Token not found'
        }
      }

      const tokenPayload = decryptData(token)
      if (!tokenPayload) {
        return {
          status: 422,
          statusCode: 422,
          code: 'invalid.session.key',
          message: 'Session key is invalid or expired'
        }
      }
      
      if (tokenPayload.userId !== detail.userId) {
        return {
          status: 422,
          statusCode: 422,
          code: 'player.not.found',
          message: 'Player is not found'
        }
      }

      const { currencyCode, gameId } = tokenPayload
      if (currencyCode === 'GC') {
        req.body.userBalance = detail.userWallet.gcCoin
      } else {
        req.body.userBalance = detail.userWallet.scCoin
      }

      req.body.detail = detail
      req.body.userId = playerId
      req.body.currencyCode = currencyCode
      req.body.gameId = gameId

      next()
    } catch (error) {
      console.error('tinyrexAuthMiddleware error:', error)
      return res.status(401).json({ status: 401 })
    }
  }
}
