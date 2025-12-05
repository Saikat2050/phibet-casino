import crypto from 'crypto'
import config from '../../configs/app.config'
import { CASINO_CALLBACK_ERRORS_CODE, CASINO_CALLBACK_ERRORS_MESSAGE, CASINO_CALLBACK_STATUS_CODE, CASINO_DEFAULT_ERROR, RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE } from '../../utils/constants/constant'
import Logger from '../../libs/logger'
import socketServer from '../../libs/socketServer'
import db from '../../db/models'
import { getOne } from '../../utils/crud'


export async function casinoCallbackMiddleware (req, res, next) {
  try {
    const userData = await getOne({
      model: db.User,
      data: { userId: req?.query?.player_id.split('_')[1] },
      attributes: ['userId', 'isActive', 'uniqueId'],
      include: [
        { model: db.Limit, as: 'userLimit', attributes: ['selfExclusion', 'isSelfExclusionPermanent', 'timeLimit'] },
        { model: db.ResponsibleGambling, as: 'responsibleGambling', attributes: ['sessionReminderTime'], where: { status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE, responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.SESSION }, required: false }
      ]
    })

    if (!userData) {
      return res.send(CASINO_DEFAULT_ERROR)
    }

    const storedToken = await socketServer.redisClient.get(`user:${userData?.uniqueId}`)
    if (!storedToken) {
      return res.send({
        status: CASINO_CALLBACK_STATUS_CODE[500],
        error: {
          code: CASINO_CALLBACK_ERRORS_CODE.ERR005,
          message: CASINO_CALLBACK_ERRORS_MESSAGE.ERR005,
          display: true
        }
      })
    }

    if (userData.selfExclusion && new Date(userData.selfExclusion) >= new Date()) {
      SelfExclusionErrorType.description = userData.selfExclusion
      return req.next(CASINO_DEFAULT_ERROR)
    }

    if (userData.userLimit.selfExclusion && new Date(userData.userLimit.selfExclusion) >= new Date()) {
      SelfExclusionErrorType.description = userData.userLimit.selfExclusion
      return req.next(CASINO_DEFAULT_ERROR)
    }

    if (userData.isBan) {
      return req.next(CASINO_DEFAULT_ERROR)
    }

    if (userData.userLimit.isSelfExclusionPermanent) {
      SelfExclusionErrorType.description = 'permanent'
      return req.next(CASINO_DEFAULT_ERROR)
    }

    const queryParams = Object.assign({}, req?.query)
    delete queryParams?.hash
    const keyValueArray = Object.entries(queryParams)
    keyValueArray.sort((a, b) => a[0].localeCompare(b[0]))
    const sortedParamsString = keyValueArray.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')

    const calculatedHash = crypto.createHmac('sha256', `${config.get('casinoConfig.casinoOneGameHubSalt')}`).update(sortedParamsString).digest('hex')

    // query hash must be equal to calculatedHash
    if (calculatedHash !== req?.query?.hash) {
      return res.send({
        status: CASINO_CALLBACK_STATUS_CODE[401],
        error: {
          code: CASINO_CALLBACK_ERRORS_CODE.ERR006,
          message: CASINO_CALLBACK_ERRORS_MESSAGE.ERR006,
          display: false
        }
      })
    }
    next()
  } catch (error) {
    Logger.error('Error while checking casino hash', error)
    console.log(error)
    return res.send(CASINO_DEFAULT_ERROR)
  }
}
