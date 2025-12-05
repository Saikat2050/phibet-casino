import ServiceBase from '../../../serviceBase'
import { sendMail } from '../../../../libs/sendgrid'
import { UserActivityService } from '../../userActivity.service'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { getUserTierDetails } from '../../../../helpers/tiers.helper'
import { CACHE_KEYS, EMAIL_TEMPLATES, KYC_STATUS, SIGN_IN_METHOD, SIGN_UP_METHOD, SOKUL_KYC_STATUS, USER_ACTIVITIES_TYPE } from '../../../../utils/constants/constant'
import { deleteRedisToken, findBaseTier, findUser, getAffiliateByDetails, getClientIp, getReferredByUser, isDailyAndWelcomeBonusClaimed, isEmailChanged, prepareImageUrl, setLoginRedisToken, settingData, signAccessToken, trackEvent, trackSokulEvent, updateUser } from '../../../../utils/common'
import moment from 'moment'
import socketServer from '../../../../libs/socketServer'
export class GoogleLoginService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        UserTier: UserTierModel,
        GlobalSetting: GlobalSettingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    let {
      ipAddress,
      isTermsAccepted = true,
      browser,
      platform,
      affiliateCode,
      affiliateId,
      referralCode,
      firstName,
      lastName,
      profileImage,
      email,
      sokulId,
      isSignup // This is from middleware,
    } = this.args

    try {
      const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
      if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

      let newGtmUser = false
      console.log(' !!!!!!!!!!!!!!!!!!!!!! Sokul Generated Id in cookies ', sokulId)
      email = email.replace(/\+(.*?)@/g, '@').toLowerCase() // Remove + keywords

      if (isSignup) {
        const isEmailChangedValue = await isEmailChanged(email)
        if (isEmailChangedValue) {
          return this.addError('EmailAlreadyUsedErrorType', '')
        }
        newGtmUser = true
        const globalSetting = await GlobalSettingModel.findOne({
          where: {
            key: 'BLOCK_PLAYER_REGISTRATION'
          },
          transaction
        })
        if (globalSetting && globalSetting?.dataValues?.value === 'true') {
          return this.addError('RegistrationBlockedErrorType', '')
        }
        const referredBy = await getReferredByUser(referralCode)
        const affiliate = referredBy ? false : await getAffiliateByDetails(affiliateCode, affiliateId)
        if (affiliate === 'ClickIdAlreadyInUseErrorType') return this.addError(affiliate)
        else if (!affiliate) affiliateCode = affiliateId = null
        else affiliateCode = affiliateCode.replaceAll('-', '')

        const newUser = {
          email,
          firstName,
          lastName,
          profileImage,
          currencyCode: 'USD',
          signInMethod: SIGN_IN_METHOD.GOOGLE,
          isEmailVerified: true,
          kycStatus: KYC_STATUS.ACCOUNT_EMAIL_VERIFIED,
          isTermsAccepted: isTermsAccepted,
          signInIp: ipAddress,
          moreDetails: {
            loginMethod: SIGN_UP_METHOD.GOOGLE,
            browser,
            platform,
            isSubscribed: true,
            isRedemptionSubscribed: true
          },
          userWallet: {
            currencyCode: 'USD'
          },
          referredBy: referredBy,
          affiliateId,
          affiliateCode
        }

        const createUser = await UserModel.create(newUser, {
          include: [
            {
              model: WalletModel,
              as: 'userWallet'
            }
          ],
          transaction
        })
        delete createUser.dataValues.password

        const [findTier] = await Promise.all([
          (findBaseTier()),
          // (!affiliate ? createPromotionUser(promocode, createUser.userId, transaction) : ''),
          sendMail({ email: createUser.email, emailTemplate: EMAIL_TEMPLATES.WELCOME_MAIL, dynamicData: { email: createUser.email, user_id: createUser.userId, name: createUser.firstName && createUser.lastName ? createUser.firstName + ' ' + createUser.lastName : createUser.firstName || 'User' } })
        ])

        await UserTierModel.create(
          {
            tierId: findTier.tierId,
            userId: createUser.userId,
            level: +findTier.level,
            maxLevel: +findTier.level
          },
          { transaction }
        )
        if (createUser?.affiliateCode) {
          const scalioData = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'reg',
            click_id: createUser?.affiliateCode.replaceAll('-', ''),
            adv_user_id: createUser?.userId,
            amount: 0,
            currency: 'USD',
            event_id: createUser?.userId
          }
          await trackEvent(scalioData)
        }
        let sokulData = {
          dt: new Date(createUser?.createdAt).toISOString().replace('T', ' ').split('.')[0],
          email: createUser?.email,
          first_name: createUser?.firstName || '',
          last_name: createUser?.lastName || '',
          kyc_status: SOKUL_KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
        }
        if (sokulId) {
          sokulData = { ...sokulData, cid: sokulId }
        }
        console.log('>>>>>>>>>>>>>>>>>>>>>>>sokul for google signup', sokulData)
        const sokulResponse = await trackSokulEvent(sokulData, 'registration', true)
        if (sokulResponse?.status === 200) {
          const updatedMoreDetails = {
            ...createUser?.moreDetails,
            sokulId: String(sokulId || ''),
            sokulResponseId: sokulResponse.data
          }

          await UserModel.update(
            { moreDetails: updatedMoreDetails },
            { where: { userId: createUser?.userId }, transaction }
          )
        } else {
          console.log('sokul response error while registration ', sokulResponse)
        }
      }
      const user = await findUser({ email }, { transaction })
      if (!user) return this.addError('UserNotExistsErrorType')
      if (!user.isActive) return this.addError('UserInActiveLoginErrorType')
      if (user.isBan) return this.addError('UserBanLoginErrorType')
      if (user?.signInMethod !== SIGN_IN_METHOD.GOOGLE) return this.addError('UseAppropriateLoginMethodErrorType')
      await Promise.all(user?.responsibleGambling.map(rsg => {
        if (rsg?.selfExclusion) return this.addError('UserAccountSelfExcludedErrorType')
        if (rsg?.timeBreakDuration && new Date(rsg?.timeBreakDuration) > new Date()) return this.addError('TimeBreakErrorType')
        return true
      }))

      let userObj = user.get({ plain: true })

      const jwtToken = await signAccessToken({ id: user.userId, name: user.firstName + ' ' + user.lastName, uuid: user.uniqueId, email: userObj.email })

      userObj.accessToken = jwtToken

      const [settingsData, claimedResponse, tierDetail, clientIP] = await Promise.all([
        settingData(),
        isDailyAndWelcomeBonusClaimed(userObj.userId, userObj.createdAt, { transaction }),
        getUserTierDetails(userObj.userId, false, transaction),
        getClientIp(this.context.req),
        updateUser(userObj, this.context.req, transaction),
        UserActivityService.execute({ activityType: USER_ACTIVITIES_TYPE.LOGIN, userId: userObj.userId, ipAddress: getClientIp(this.context.req) }, this.context),
        deleteRedisToken({ key: `gamePlay-${userObj.uniqueId}` }),
        setLoginRedisToken({ key: `user:${userObj.uniqueId}`, token: jwtToken, sessionTime: userObj.sessionTime }),
        (userObj?.profileImage ? userObj.profileImage = prepareImageUrl(userObj.profileImage) : null)
      ])
      delete userObj.password
      delete userObj.signInIp

      userObj = { ...userObj, ...claimedResponse, tierDetail, ...settingsData, clientIP, newGtmUser }

      delete userObj?.password
      delete userObj?.signInIp
      return {
        user: { ...userObj, signInCount: userObj.signInCount + 1 },
        message: 'Logged in Successfully!',
        success: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log('Error while logging from google', error)
      return this.addError('InternalServerErrorType')
    }
  }
}
