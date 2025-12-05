import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import axios from 'axios'
import { CreateWalletService } from './createWallet.service'
import _ from 'lodash'
import { CACHE_KEYS, JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { appConfig } from '@src/configs'
import { Cache } from '@src/libs/cache'
import { GetIpLocationService } from '../common/getIpLocation.service'
import { CheckAndUpdateAllLimits } from '../responsibleGambling/checkAndUpdateAllLimits.service'
import { CreateUserAcitivityService } from './createUserActivity'
import { GetDailyBonusService } from '../bonus/getDailyBonus.service'
import { EMAIL_TEMPLATE_EVENT_TYPES, KYC_STATUS, SELF_EXCLUSION_TYPES, SIGN_IN_METHOD, USER_ACTIVITY, USER_GENDER } from '@src/utils/constants/public.constants.utils'
import jwt from 'jsonwebtoken'
import { GetScaleoAffiliateDetailService } from '../common/getScaleoAffiliateDetail.service'
import { dayjs } from '@src/libs/dayjs'
import { GetWelcomePackageService } from '@src/services/bonus/getWelcomePackage.service'
import { AvailJoiningBonusAndZeroVipLevelService } from './commonAvailCoins.service'
import { ScaleoAxios } from '@src/libs/axios/scaleo.axios'
import moment from 'moment-timezone'
import { SendEmailService } from '../emailTemplate/sendMail.service'
import { populateUserDetails } from '@src/helpers/populateLocalCache.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    credential: { type: 'string' },
    ipAddress: { type: 'string' },
    referralCode: { type: 'string' },
    username: { type: 'string' },
    affiliateCode: { type: 'string' },
    affiliateId: { type: 'string' }
  },
  required: ['credential', 'ipAddress']
})

export class GoogleSignUpLoginService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const {
      user: userModel,
      wallet: walletModel,
      currency: currencyModel,
      userLimit: userLimitModel,
      userVipTier: userVipTierModel
    } = this.context.sequelize.models
    const { ipAddress, referralCode, credential } = this.args
    let { affiliateCode, affiliateId } = this.args

    try {
      const { result: { country, state } } = await GetIpLocationService.execute({ ipAddress }, this.context)
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${credential}` } }
      )
      const { given_name: firstName, family_name: lastName, email } = userInfo.data

      const user = await userModel.findOne({
        where: { email },
        include: [{
          model: walletModel,
          separate: true,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: currencyModel,
            where: { isActive: true },
            required: true
          }
        }, {
          attributes: ['key', 'value', 'expireAt', 'id'],
          model: this.context.sequelize.models.userLimit,
          required: true
        }],
        attributes: { exclude: ['phoneOtp', 'password'] },
        transaction
      })

      if (!user) {
        const uuidRegexV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        if (referralCode && !uuidRegexV4.test(referralCode)) referralCode = ''

        const affiliateResult = (referralCode || !affiliateCode || !affiliateId) ? false : await GetScaleoAffiliateDetailService.execute(affiliateCode, affiliateId)
        if (_.size(affiliateResult.errors)) return this.mergeErrors(affiliateResult?.errors)
        else if (!affiliateResult?.result?.success) affiliateCode = affiliateId = null
        else affiliateCode = affiliateCode.replaceAll('-', '')

        const userData = {
          kycStatus: KYC_STATUS.PENDING,
          countryId: country.id,
          email: email,
          lastLoggedInIp: ipAddress,
          password: null,
          username: this.args.username || `${email.split('@')[0]}_${Math.random().toString(36).substring(2, 7)}`,
          phone: this.args.phone || null,
          gender: this.args.gender || USER_GENDER.UNKNOWN,
          lastName: lastName,
          firstName: firstName,
          phoneCode: this.args.phoneCode || null,
          dateOfBirth: this.args.dateOfBirth || null,
          loggedIn: true,
          signInMethod: SIGN_IN_METHOD.GOOGLE,
          affiliateCode,
          affiliateId
        }

        const newUser = await userModel.create(userData, { transaction })
        const currencies = await currencyModel.findAll({ raw: true, transaction })
        newUser.limits = await userLimitModel.createAll(newUser.id, { transaction })

        newUser.wallets = await Promise.all(currencies.map(async (currency) => {
          const wallet = await CreateWalletService.execute({ userId: newUser.id, currencyId: currency.id, isDefault: currency.isDefault }, this.context)
          if (_.size(wallet.errors)) return this.mergeErrors(wallet.errors)
          return wallet
        }))

        if (state?.code) {
          await this.context.sequelize.models.address.create({
            countryCode: country.code,
            city: '',
            zipCode: '',
            stateCode: state.code,
            userId: newUser.id
          }, { transaction })
        }

        const vipLevel = await Cache.get(CACHE_KEYS.VIP_TIER)
        const levelZero = vipLevel.find(obj => obj.level === 0)
        await userVipTierModel.create({ userId: newUser.id, vipLevelId: levelZero?.id }, { transaction })

        const getWelcomePackage = await GetWelcomePackageService.execute({}, this.context)
        if (getWelcomePackage?.result?.welcomePackage) {
          const time = moment(newUser.createdAt).add(getWelcomePackage?.result?.welcomePackage?.timer, 'hours').format()
          if (moment().format() > time) getWelcomePackage.result = { welcomePackage: null }
        }
        if (affiliateCode) {
          await ScaleoAxios.sendEventData({
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            type: 'reg',
            click_id: affiliateCode.replaceAll('-', ''),
            adv_user_id: newUser.id,
            amount: 0,
            currency: 'USD',
            event_id: newUser.id
          })
        }

        await transaction.commit()

        const emailVerificationToken = jwt.sign({ userId: newUser.id, type: JWT_TOKEN_TYPES.VERIFY_EMAIL, date: new Date() }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiry })
        // SendEmailService.execute({
        //   email: newUser.email,
        //   firstName: newUser.username,
        //   verificationLink: `${appConfig.app.userFeUrl}/verify-email?token=${emailVerificationToken}`,
        //   url: appConfig.app.userFeUrl,
        //   supportEmail: 'noreply@phibet.com',
        //   eventType: EMAIL_TEMPLATE_EVENT_TYPES.EMAIL_VERIFICATION
        // })
        await populateUserDetails()

        Promise.all([AvailJoiningBonusAndZeroVipLevelService.execute({ userDetails: newUser, referralCode, levelZero })])
        const getBonus = await GetDailyBonusService.execute({ userId: newUser.id }, this.context)

        return {
          success: true,
          activeBonus: getBonus?.result,
          user: { ...newUser.dataValues, userBonus: [] },
          joiningBonus: null,
          getWelcomePackage: getWelcomePackage?.result || null
        }
      }

      if (!user.isActive) return this.addError('UserInactiveErrorType')
      if (user.userLimit.value === SELF_EXCLUSION_TYPES.PERMANENT) return this.addError('ExcludedPermanentlyPleaseContactProviderErrorType')
      if (user.userLimit.value === SELF_EXCLUSION_TYPES.TEMPORARY && !dayjs().isAfter(user.userLimit.expireAt)) return this.addError('SelfExcludedErrorType')
      await CheckAndUpdateAllLimits.execute({ userId: user.id, limit: user.userLimit, isActive: user.isActive, activity: true }, this.context)

      user.loggedIn = true
      user.loggedInAt = new Date()
      user.lastLoggedInIp = ipAddress
      user.signInMethod = SIGN_IN_METHOD.GOOGLE
      await user.save({ transaction })

      const getWelcomePackage = await GetWelcomePackageService.execute({}, this.context)
      if (getWelcomePackage?.result?.welcomePackage) {
        const time = moment(user.createdAt).add(getWelcomePackage?.result?.welcomePackage?.timer, 'hours').format()
        if (moment().format() > time) getWelcomePackage.result = { welcomePackage: null }
      }
      await CreateUserAcitivityService.execute({ userId: user.id, activityType: USER_ACTIVITY.LOGIN }, this.context)
      const getBonus = await GetDailyBonusService.execute({ userId: user.id }, this.context)

      return { user, activeBonus: getBonus?.result, getWelcomePackage: getWelcomePackage?.result || null }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
