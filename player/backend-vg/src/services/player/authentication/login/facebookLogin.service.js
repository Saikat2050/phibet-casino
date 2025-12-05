import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import { plus } from 'number-precision'
import ServiceBase from '../../../serviceBase'
import { sendMail } from '../../../../libs/sendgrid'
import { UserActivityService } from '../../userActivity.service'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { getUserTierDetails } from '../../../../helpers/tiers.helper'
import { EMAIL_TEMPLATES, KYC_STATUS, ROLE, SIGN_IN_METHOD, SIGN_UP_METHOD, DOCUMENTS, RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE, STATUS, STATUS_VALUE, USER_ACTIVITIES_TYPE, SOKUL_KYC_STATUS, CACHE_KEYS } from '../../../../utils/constants/constant'
import { deleteRedisToken, getAffiliateByDetails, getClientIp, getReferredByUser, getResponsibleGamblingData, isDailyAndWelcomeBonusClaimed, isEmailChanged, loginUser, prepareImageUrl, setLoginRedisToken, signAccessToken, trackEvent, trackSokulEvent, updateUser } from '../../../../utils/common'
import config from '../../../../configs/app.config'
import moment from 'moment'
import socketServer from '../../../../libs/socketServer'

//  NOT UPDATE ACCORDING TO CURRENT WORKFLOW
export class FacebookLoginService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Tier: TierModel,
        Limit: LimitModel,
        Wallet: WalletModel,
        UserTier: UserTierModel,
        AdminUser: AdminUserModel,
        UserDocument: UserDocumentModel,
        GlobalSetting: GlobalSettingModel,
        ResponsibleGambling: ResponsibleGamblingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    let {
      firstName,
      lastName,
      email,
      userId,
      ipAddress,
      isTermsAccepted = true,
      browser,
      platform,
      affiliateCode,
      affiliateId,
      referralCode,
      isForceEmail,
      sokulId
    } = this.args

    try {
      const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
      if (globalSetting === 'true') return this.addError('MaintenanceErrorType')
      let newGtmUser = false
      console.log(' !!!!!!!!!!!!!!!!!!!!!! Sokul Generated Id in cookies ', sokulId)
      if (email) {
        email = email.replace(/\+(.*?)@/g, '@').toLowerCase()
        const userAlreadyExist = await UserModel.findOne({
          attributes: ['signInMethod'],
          where: { email },
          transaction
        })
        if (userAlreadyExist && +userAlreadyExist.signInMethod !== SIGN_UP_METHOD.FACEBOOK) {
          return this.addError('DifferentSignUpMethodErrorType', '')
        }
      }
      let user = await UserModel.findOne({
        where: { fbUserId: userId },
        transaction,
        include: [
          {
            model: LimitModel,
            as: 'userLimit',
            attributes: [
              'selfExclusion',
              'isSelfExclusionPermanent',
              'timeLimit'
            ]
          },
          {
            model: WalletModel,
            as: 'userWallet',
            attributes: [
              'totalScCoin',
              'walletId',
              'amount',
              'currencyCode',
              'ownerType',
              'ownerId',
              'non_cash_amount',
              'gcCoin',
              'scCoin'
            ]
          },
          {
            model: UserDocumentModel,
            as: 'userDocuments',
            attributes: ['documentName', 'documentUrl', 'status'],
            where: {
              documentName: {
                [Op.in]: [
                  DOCUMENTS.ADDRESS,
                  DOCUMENTS.ID,
                  DOCUMENTS.BANK_CHECKING
                ]
              }
            },
            required: false
          },
          {
            model: ResponsibleGamblingModel,
            as: 'responsibleGambling',
            attributes: ['sessionReminderTime'],
            where: {
              status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
              responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.SESSION
            },
            required: false
          }
        ]
      })
      if (!user) {
        const isEmailChangedValue = await isEmailChanged(email)
        if (isEmailChangedValue) {
          return this.addError('EmailAlreadyUsedErrorType', '')
        }
        newGtmUser = true
        const referredBy = await getReferredByUser(referralCode)

        const affiliate = await getAffiliateByDetails(affiliateCode, affiliateId)

        if (affiliate === 'ClickIdAlreadyInUseErrorType') return this.addError(affiliate)
        else if (!affiliate) affiliateCode = affiliateId = null
        else affiliateCode = affiliateCode.replaceAll('-', '')

        const adminUser = await AdminUserModel.findOne()

        const newUser = {
          email,
          firstName,
          lastName,
          fbUserId: userId,
          currencyCode: 'USD',
          parentId: adminUser.adminUserId,
          parentType: ROLE.ADMIN,
          signInMethod: SIGN_IN_METHOD.FACEBOOK,
          isEmailVerified: true,
          kycStatus: KYC_STATUS.ACCOUNT_EMAIL_VERIFIED,
          isTermsAccepted: isTermsAccepted,
          signInIp: ipAddress,
          moreDetails: {
            loginMethod: SIGN_UP_METHOD.FACEBOOK,
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
        const OTP = Math.floor(100000 + Math.random() * 900000)

        if (email && isForceEmail) {
          newUser.emailToken = jwt.sign(
            { email: email, otp: OTP },
            config.get('jwt.emailTokenKey'),
            { expiresIn: config.get('jwt.emailTokenExpiry') }
          )
          newUser.newOtpRequested = new Date()
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
        if (email && isForceEmail) {
          sendMail({
            email: createUser.email,
            emailTemplate: EMAIL_TEMPLATES.VERIFY_EMAIL,
            dynamicData: {
              email: createUser.email,
              otp: OTP,
              user_id: createUser.userId,
              userName: createUser.firstName && createUser.lastName ? createUser.firstName + ' ' + createUser.lastName : createUser.firstName || 'User'
            }
          })
        }

        delete createUser.dataValues.password

        await LimitModel.create(
          {
            userId: createUser.userId
          },
          { transaction }
        )

        // if (!affiliate) await createPromotionUser(promocode, createUser.userId)

        const findTier = await TierModel.findOne({
          where: {
            isActive: true,
            requiredXp: 0
          }
        })

        await UserTierModel.create(
          {
            tierId: findTier.tierId,
            userId: createUser.userId,
            level: +findTier.level,
            maxLevel: +findTier.level
          },
          { transaction }
        )

        if (email && !isForceEmail) {
          sendMail({
            email: createUser.email,
            emailTemplate: EMAIL_TEMPLATES.WELCOME_MAIL,
            dynamicData: {
              email: createUser.email,
              user_id: createUser.userId
            }
          })
        }

        user = await UserModel.findOne({
          where: { fbUserId: userId },
          transaction,
          include: [
            {
              model: LimitModel,
              as: 'userLimit',
              attributes: [
                'selfExclusion',
                'isSelfExclusionPermanent',
                'timeLimit'
              ]
            },
            {
              model: WalletModel,
              as: 'userWallet',
              attributes: [
                'totalScCoin',
                'walletId',
                'amount',
                'currencyCode',
                'ownerType',
                'ownerId',
                'non_cash_amount',
                'gcCoin',
                'scCoin'
              ]
            },
            {
              model: UserDocumentModel,
              as: 'userDocuments',
              attributes: ['documentName', 'documentUrl', 'status'],
              where: {
                documentName: {
                  [Op.in]: [
                    DOCUMENTS.ADDRESS,
                    DOCUMENTS.ID,
                    DOCUMENTS.BANK_CHECKING
                  ]
                }
              },
              required: false
            },
            {
              model: ResponsibleGamblingModel,
              as: 'responsibleGambling',
              attributes: ['sessionReminderTime'],
              where: {
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
                responsibleGamblingType: RESPONSIBLE_GAMBLING_TYPE.SESSION
              },
              required: false
            }
          ]
        })
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
        console.log('>>>>>>>>>>>>>>>>>>>>>>>sokul for facebook signup', sokulData)
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

      if (!user) return this.addError('UserNotExistsErrorType')
      if (!user.isActive) return this.addError('UserInActiveLoginErrorType')
      if (user.isBan) return this.addError('UserBanLoginErrorType')
      if (user?.signInMethod !== SIGN_IN_METHOD.FACEBOOK) return this.addError('UseAppropriateLoginMethodErrorType')
      const selfExclusion = await ResponsibleGamblingModel.findOne({
        where: {
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
          userId: user.userId,
          selfExclusion: true
        }
      })

      if (selfExclusion) return this.addError('UserAccountSelfExcludedErrorType')

      user.dataValues.userWallet.gcCoin = +user.userWallet.gcCoin.toFixed(2)
      user.dataValues.userWallet.totalScCoin = +plus(
        user.userWallet.scCoin.bsc,
        user.userWallet.scCoin.psc,
        user.userWallet.scCoin.wsc
      ).toFixed(2)

      user.dataValues.status = STATUS_VALUE.PENDING
      user.dataValues.bankStatus = STATUS_VALUE.PENDING

      if (user?.userDocuments?.length && user?.userDocuments?.length === 3) {
        if (user?.userDocuments[0].status === STATUS.APPROVED && user?.userDocuments[2].status === STATUS.APPROVED) user.dataValues.status = STATUS_VALUE.APPROVED
        else if (user?.userDocuments[0].status === STATUS.REJECTED || user?.userDocuments[2].status === STATUS.REJECTED) user.dataValues.status = STATUS_VALUE.REJECTED
        else user.dataValues.status = STATUS_VALUE.REQUESTED

        if (user?.userDocuments[1].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
        else if (user?.userDocuments[1].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED
        else user.dataValues.bankStatus = STATUS_VALUE.REQUESTED
      } else if (user?.userDocuments?.length && user?.userDocuments?.length === 2) {
        if (user?.userDocuments[0].documentName === DOCUMENTS.ADDRESS && user?.userDocuments[1].documentName === DOCUMENTS.ID) {
          if (user?.userDocuments[0].status === STATUS.APPROVED && user?.userDocuments[1].status === STATUS.APPROVED) user.dataValues.status = STATUS_VALUE.APPROVED
          else if (user?.userDocuments[0].status === STATUS.REJECTED || user?.userDocuments[1].status === STATUS.REJECTED) user.dataValues.status = STATUS_VALUE.REJECTED
          else user.dataValues.status = STATUS_VALUE.REQUESTED
        }
      }

      const takeABreakTimeStamp = user.dataValues.selfExclusion
      const selfExclusionTimeStamp = user.userLimit.selfExclusion
      const isSelfExclusionPermanent = user.userLimit.selfExclusion
      const sessionTime = user.userLimit.timeLimit

      let userObj = user.get({ plain: true })
      userObj.sessionTime = sessionTime

      if (takeABreakTimeStamp && new Date(takeABreakTimeStamp) >= new Date()) {
        userObj.selfExclusion = true
        userObj.expiration = takeABreakTimeStamp
      } else if (
        selfExclusionTimeStamp &&
        new Date(selfExclusionTimeStamp) >= new Date()
      ) {
        userObj.selfExclusion = true
        userObj.expiration = selfExclusionTimeStamp
      } else if (isSelfExclusionPermanent) {
        userObj.selfExclusion = true
        userObj.expiration = 'permanent'
      } else {
        userObj.selfExclusion = false
        userObj.expiration = null
      }

      const tokenKeys = {
        id: user.userId,
        name: user.firstName + ' ' + user.lastName,
        uuid: user.uniqueId,
        sessionTime,
        email: userObj.email
      }

      const jwtToken = await signAccessToken(tokenKeys)

      const settings = await GlobalSettingModel.findAll({
        attributes: ['key', 'value'],
        where: {
          key: [
            'MINIMUM_REDEEMABLE_COINS',
            'MAXIMUM_REDEEMABLE_COINS',
            'MINIMUM_SC_SPIN_LIMIT',
            'MINIMUM_GC_SPIN_LIMIT',
            'MAX_SC_VAULT_PER',
            'MAX_GC_VAULT_PER'
          ]
        },
        raw: true,
        transaction
      })
      const settingMap = settings.reduce((map, { key, value }) => {
        map[key] = +value || 0
        return map
      }, {})
      const {
        MINIMUM_REDEEMABLE_COINS: minimumCoins,
        MAXIMUM_REDEEMABLE_COINS: maximumCoins,
        MINIMUM_SC_SPIN_LIMIT: scSpinLimit,
        MINIMUM_GC_SPIN_LIMIT: gcSpinLimit,
        MAX_SC_VAULT_PER: maximumScVaultPercentage,
        MAX_GC_VAULT_PER: maximumGcVaultPercentage
      } = settingMap

      userObj.minRedeemableCoins = minimumCoins
      userObj.maxRedeemableCoins = maximumCoins
      userObj.scSpinLimit = scSpinLimit
      userObj.gcSpinLimit = gcSpinLimit
      userObj.maximumScVaultPercentage = maximumScVaultPercentage
      userObj.maximumGcVaultPercentage = maximumGcVaultPercentage
      userObj.accessToken = jwtToken

      await Promise.all([
        (updateUser(userObj, this.context.req, transaction)),
        (loginUser(userObj, transaction)),
        (UserActivityService.execute(
          {
            activityType: USER_ACTIVITIES_TYPE.LOGIN,
            userId: user.userId,
            ipAddress: getClientIp(this.context.req)
          },
          this.context
        )),
        (
          setLoginRedisToken({
            key: `user:${userObj.uniqueId}`,
            token: jwtToken,
            sessionTime: userObj.sessionTime
          })
        ),
        (deleteRedisToken({ key: `gamePlay-${user.uniqueId}` }))
      ])

      delete userObj.password
      delete userObj.signInIp

      const timeBreak = await getResponsibleGamblingData({
        userId: userObj.userId,
        responsibleGamblingType: '4'
      })

      const currentDate = new Date()
      const timeBreakValue =
        timeBreak?.responsibleGamblingData?.timeBreakDuration
      const timeBreakDuration = new Date(timeBreakValue)
      if (timeBreakDuration > currentDate) {
        return this.addError('TimeBreakErrorType')
      }

      const [claimedResponse, tierDetail] = await Promise.all([(isDailyAndWelcomeBonusClaimed(userObj.userId, userObj.createdAt, { transaction })), (getUserTierDetails(userObj.userId, false, transaction))])

      userObj = { ...userObj, ...claimedResponse, tierDetail, newGtmUser }

      if (userObj.profileImage !== '' && userObj?.profileImage) {
        userObj.profileImage = prepareImageUrl(userObj.profileImage)
      }

      userObj.clientIP = getClientIp(this.context.req)
      return {
        user: { ...userObj, signInCount: userObj.signInCount + 1 },
        message: 'Logged in Successfully!',
        success: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalSeverErrorType')
    }
  }
}
