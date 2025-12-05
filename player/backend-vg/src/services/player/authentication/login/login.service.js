import ServiceBase from '../../../serviceBase'
import { UserActivityService } from '../../userActivity.service'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { getUserTierDetails } from '../../../../helpers/tiers.helper'
import { CACHE_KEYS, USER_ACTIVITIES_TYPE } from '../../../../utils/constants/constant'
import { comparePassword, deleteRedisToken, findUser, getClientIp, isDailyAndWelcomeBonusClaimed, prepareImageUrl, setLoginRedisToken, settingData, signAccessToken, trackSokulEvent } from '../../../../utils/common'
import moment from 'moment'
import { plus } from 'number-precision'
import socketServer from '../../../../libs/socketServer'
import DuplicateLoginEmitter from '../../../../socket-resources/emitter/duplicate.emmiter'

export class LoginService extends ServiceBase {
  async run () {
    try {
      const {
        dbModels: {
          User: UserModel
        },
        sequelizeTransaction: transaction
      } = this.context

      const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
      if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

      let { email, password } = this.args

      email = email.replace(/\+(.*?)@/g, '@').toLowerCase() // Remove + keywords

      const where = { email }

      const user = await findUser(where, { transaction })

      if (!user) return this.addError('UserNotExistsErrorType')
      if (!user.isActive) return this.addError('UserInActiveLoginErrorType')
      if (user.isBan) return this.addError('UserBanLoginErrorType')
      if (!user.password) return this.addError('UserAssociatedWithSocialLoginErrorType')
      if (+user.passwordAttempt > 4) return this.addError('MaxPasswordAttemptErrorType')

      if (user?.responsibleGambling && user?.responsibleGambling?.length) {
        const rsg = user?.responsibleGambling[0]
        if (rsg && rsg?.selfExclusion && rsg?.permanentSelfExcluded) return this.addError('UserPermanentSelfExcludedErrorType', 'Your Account is Permanently Self Excluded')
        if (rsg && rsg?.selfExclusion && moment(rsg?.timeBreakDuration) > moment()) return this.addError('UserAccountSelfExcludedErrorType', `Your Account is Self Excluded till ${moment(rsg?.timeBreakDuration).format('MMM-DD-YYYY')}`)
        if (rsg && rsg?.timeBreakDuration && new Date(rsg?.timeBreakDuration) > new Date()) return this.addError('TimeBreakErrorType')

        if (!user?.moreDetails?.sokulPlayerActive) {
          await trackSokulEvent({ email, status: 'active' }, 'updateUser')
          user.moreDetails = {
            ...user.moreDetails,
            sokulPlayerActive: true
          }
          await UserModel.update(
            { moreDetails: user.moreDetails },
            { where: { userId: user.userId }, transaction }
          )
        }
      }

      if (!(await comparePassword(password, user.password))) {
        await UserModel.update({ passwordAttempt: +plus(+user.passwordAttempt, 1) }, { where: { userId: +user.userId } })
        return this.addError('LoginPasswordErrorType')
      }
      let userObj = user.get({ plain: true })

      const jwtToken = await signAccessToken({ id: user.userId, name: user.firstName + ' ' + user.lastName, uuid: user.uniqueId, email: user.email })
      const storedToken = await socketServer.redisClient.get(`user:${userObj.uniqueId}`)
      if (storedToken && (storedToken !== userObj.accessToken)) {
        await DuplicateLoginEmitter.duplicate(storedToken)
      }

      userObj.accessToken = jwtToken

      const [settingsData, claimedResponse, tierDetail, clientIP] = await Promise.all([
        settingData(),
        isDailyAndWelcomeBonusClaimed(userObj.userId, userObj.createdAt, { transaction }),
        getUserTierDetails(userObj.userId, false, transaction),
        getClientIp(this.context.req),
        (UserModel.update({ passwordAttempt: 0, signInCount: +userObj.signInCount + 1, signInIp: getClientIp(this.context.req), lastLoginDate: new Date() }, { where: { userId: userObj.userId }, transaction })),
        UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.LOGIN, userId: userObj.userId, ipAddress: getClientIp(this.context.req) }, this.context),
        deleteRedisToken({ key: `gamePlay-${userObj.uniqueId}` }),
        setLoginRedisToken({ key: `user:${userObj.uniqueId}`, token: jwtToken }),
        (userObj?.profileImage ? userObj.profileImage = prepareImageUrl(userObj.profileImage) : null)
      ])

      delete userObj.password
      delete userObj.signInIp

      userObj = { ...userObj, ...claimedResponse, tierDetail, ...settingsData, clientIP }

      return {
        user: { ...userObj, signInCount: userObj.signInCount + 1 },
        message: 'Logged in Successfully!',
        success: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log('Error in Login Service', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
