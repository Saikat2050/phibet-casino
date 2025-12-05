import jwt from 'jsonwebtoken'
import { captureMessage } from '@sentry/node'
import ServiceBase from '../../../serviceBase'
import config from '../../../../configs/app.config'
import { sendMail } from '../../../../libs/sendgrid'
import { SUCCESS_MSG } from '../../../../utils/constants/success'
import { SIGN_IN_METHOD, KYC_STATUS, SIGN_UP_METHOD, EMAIL_TEMPLATES, SOKUL_KYC_STATUS, CACHE_KEYS } from '../../../../utils/constants/constant'
import { encryptPassword, findBaseTier, getAffiliateByDetails, getReferredByUser, validatePassword, checkIfEmailExists, trackEvent, trackSokulEvent, isEmailChanged, isSuspiciousEmail } from '../../../../utils/common'
import moment from 'moment'
import socketServer from '../../../../libs/socketServer'
export class PlayerSignUpService extends ServiceBase {
  async run () {
    let { email, password, ipAddress, isTermsAccepted, browser, platform, referralCode, affiliateCode, affiliateId, firstName, lastName, sokulId } = this.args
    const globalSetting = await socketServer.redisClient.get(CACHE_KEYS.MAINTENANCE)
    if (globalSetting === 'true') return this.addError('MaintenanceErrorType')

    let OTP
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        UserTier: UserTierModel,
        GlobalSetting: GlobalSettingModel,
        TermsAndConditions: TermsAndConditionsModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const isEmailChangedValue = await isEmailChanged(email)
      if (isEmailChangedValue) {
        return this.addError('EmailAlreadyUsedErrorType', '')
      }
      const emailCheck = await checkIfEmailExists(email)
      if (emailCheck) {
        return this.addError('EmailExistErrorType', '')
      }
      const globalSetting = await GlobalSettingModel.findOne({
        where: {
          key: 'BLOCK_PLAYER_REGISTRATION'
        },
        transaction
      })

      if (globalSetting && globalSetting?.dataValues?.value === 'true') {
        return this.addError('RegistrationBlockedErrorType', '')
      }
      if (!isTermsAccepted) return this.addError('TermsAndConditionErrorType')

      if (isSuspiciousEmail(email)) {
        return this.addError('EmailDomainNotAllowedErrorType')
      }

      if (!validatePassword(password)) return this.addError('PasswordValidationFailedError')

      // Note : We don't need to check if email exists in our database here, as it is being checked in a middleware - emailSignupLogin

      const referredBy = await getReferredByUser(referralCode)

      const affiliate = referredBy ? false : await getAffiliateByDetails(affiliateCode, affiliateId)
      if (affiliate === 'ClickIdAlreadyInUseErrorType') return this.addError(affiliate)
      else if (!affiliate) affiliateCode = affiliateId = null
      else affiliateCode = affiliateCode.replaceAll('-', '')
      const activeTerms = await TermsAndConditionsModel.findOne({
        where: { status: 'active' },
        attributes: ['id', 'description', 'link', 'createdAt'],
        order: [['created_at', 'DESC']]
      })
      const newUser = {
        email: email.toLowerCase().replace(/\+(.*?)@/g, '@'),
        password: encryptPassword(password),
        currencyCode: 'USD',
        signInMethod: SIGN_IN_METHOD.NORMAL,
        isEmailVerified: false,
        kycStatus: KYC_STATUS.ACCOUNT_CREATED,
        isTermsAccepted: true,
        firstName,
        lastName,
        signInIp: ipAddress,
        affiliateId,
        affiliateCode,
        moreDetails: {
          loginMethod: SIGN_UP_METHOD.EMAIL,
          browser,
          platform,
          isSubscribed: true,
          isRedemptionSubscribed: true,
          termsAndConditionsAccepted: activeTerms
            ? [{
                id: activeTerms.id,
                description: activeTerms.description,
                link: activeTerms.link,
                acceptedAt: activeTerms.createdAt
              }]
            : []
        },
        userWallet: {
          currencyCode: 'USD'
        },
        referredBy: referredBy
      }

      OTP = Math.floor(100000 + Math.random() * 900000)

      newUser.emailToken = jwt.sign(
        { email: email, otp: OTP },
        config.get('jwt.emailTokenKey'),
        { expiresIn: config.get('jwt.emailTokenExpiry') }
      )

      newUser.newOtpRequested = new Date()

      const createUser = await UserModel.create(newUser, {
        include: [
          {
            model: WalletModel,
            as: 'userWallet'
          }
        ],
        transaction
      })

      const [findTier] = await Promise.all([
        (findBaseTier({ transaction }))
        // (!affiliate ? createPromotionUser(promocode, createUser.userId, transaction) : '')
      ])

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
        kyc_status: SOKUL_KYC_STATUS.ACCOUNT_CREATED
      }
      if (sokulId) {
        sokulData = { ...sokulData, cid: sokulId }
      }
      const sokulResponse = await trackSokulEvent(sokulData, 'registration')
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
      }
      return {
        user: createUser,
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      captureMessage(`Error in PlayerSignupService: ${error.message}`, 'error')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
