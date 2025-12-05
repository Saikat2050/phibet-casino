import moment from 'moment'
import * as jwt from 'jsonwebtoken'
import Logger from '../../libs/logger'
import config from '../../configs/app.config'
import socketServer from '../../libs/socketServer'
import { deleteRedisToken, findUser, resetSocketLoginToken } from '../../utils/common'
import { MultiLoginErrorType, TokenExpiredErrorType, UnAuthorizeUserErrorType, UserAccountSelfExcludedErrorType, UserBanErrorType, UserInActiveErrorType, UserPermanentSelfExcludedErrorType } from '../../utils/constants/errors'
import { RESPONSIBLE_GAMBLING_STATUS } from '../../utils/constants/constant'

export async function isUserAuthenticated (req, res, next) {
  try {
    req.next = next
    const token = req?.headers?.accesstoken

    if (!token) {
      return req.next(UnAuthorizeUserErrorType)
    }

    let decodedToken
    try {
      decodedToken = jwt.verify(token, config.get('jwt.loginTokenSecret'))
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return req.next(TokenExpiredErrorType)
      }
      return req.next(UnAuthorizeUserErrorType)
    }

    if (!decodedToken) return req.next(UnAuthorizeUserErrorType)

    const detail = await findUser({ userId: decodedToken?.id }, null)

    if (!detail) return req.next(UnAuthorizeUserErrorType)
    if (!detail.isActive) return req.next(UserInActiveErrorType)
    if (detail.isBan) return req.next(UserBanErrorType)
    if (detail?.responsibleGambling && detail?.responsibleGambling?.length && detail?.responsibleGambling[0]?.dataValues?.selfExclusion && detail?.responsibleGambling[0]?.dataValues?.status === RESPONSIBLE_GAMBLING_STATUS.ACTIVE && detail?.responsibleGambling[0]?.dataValues?.permanentSelfExcluded) {
      req.next(UserPermanentSelfExcludedErrorType)
    }
    if (detail?.responsibleGambling && detail?.responsibleGambling?.length && detail?.responsibleGambling[0]?.dataValues?.selfExclusion && detail?.responsibleGambling[0]?.dataValues?.status === RESPONSIBLE_GAMBLING_STATUS.ACTIVE && moment(detail?.responsibleGambling[0]?.dataValues?.timeBreakDuration) > moment()) {
      req.next({ ...UserAccountSelfExcludedErrorType, description: `Your Account is Self Excluded till ${moment(detail?.responsibleGambling[0]?.dataValues?.timeBreakDuration).format('MMM-DD-YYYY')}` })
    }

    const storedToken = await socketServer.redisClient.get(
      `user:${detail.uniqueId}`
    )

    if (!storedToken) return req.next(UnAuthorizeUserErrorType)

    if (storedToken && storedToken !== token) {
      res.removeHeader('accessToken')
      await deleteRedisToken({ key: `user:${detail.uniqueId}` })
      await deleteRedisToken({ key: `gamePlay-${detail.uniqueId}` })
      return req.next(MultiLoginErrorType)
    }

    await resetSocketLoginToken({ key: `user:${detail.uniqueId}` })

    req.body.user = { detail }
    req.user = { detail }
    req.userId = detail.userId
    req.body.id = detail.userId
    req.body.uniqueId = detail.uniqueId

    req.next()
  } catch (error) {
    Logger.error('Error in authenticationMiddleware', {
      message: error.message,
      context: {
        traceId: req?.context?.traceId,
        query: req.query,
        params: req.params,
        body: req.body,
        headers: req.headers
      },
      exception: error
    })

    next(UnAuthorizeUserErrorType)
  }
}
