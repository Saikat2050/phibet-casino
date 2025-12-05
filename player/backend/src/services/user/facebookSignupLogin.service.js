import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { CreateWalletService } from './createWallet.service'
import _ from 'lodash'
import { CACHE_KEYS, JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { appConfig } from '@src/configs'
import { Cache } from '@src/libs/cache'
import { GetIpLocationService } from '../common/getIpLocation.service'
import { CheckAndUpdateAllLimits } from '../responsibleGambling/checkAndUpdateAllLimits.service'
import { CreateUserAcitivityService } from './createUserActivity'
import { GetDailyBonusService } from '../bonus/getDailyBonus.service'
import { KYC_STATUS, SELF_EXCLUSION_TYPES, SIGN_IN_METHOD, USER_ACTIVITY } from '@src/utils/constants/public.constants.utils'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { GetScaleoAffiliateDetailService } from '../common/getScaleoAffiliateDetail.service'
import { dayjs } from '@src/libs/dayjs'
import { GetWelcomePackageService } from '@src/services/bonus/getWelcomePackage.service'
import { AvailJoiningBonusAndZeroVipLevelService } from './commonAvailCoins.service'
import { ScaleoAxios } from '@src/libs/axios/scaleo.axios'
import { sendEmail } from '@src/libs/s3'
import moment from 'moment-timezone'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    ipAddress: { type: 'string' },
    referralCode: { type: 'string' },
    username: { type: 'string', default: '' },
    isSignup: { type: 'boolean' },
    affiliateCode: { type: 'string' },
    affiliateId: { type: 'string' }
  },
  required: ['email', 'ipAddress', 'isSignup']
})

export class FacebookSignUpLoginService extends ServiceBase {
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
    const { ipAddress, referralCode, email, firstName, lastName, username, isSignup } = this.args
    let { affiliateCode, affiliateId } = this.args

    try {
      const { result: { country, state } } = await GetIpLocationService.execute({ ipAddress }, this.context)

      let where = { email, isActive: true }
      if (isSignup) where = { [Op.or]: [{ email }, { username }] }
      const user = await userModel.findOne({
        where,
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
      if (user && isSignup) return this.addError('UsernameOrEmailAlreadyExistsErrorType')
      else if (!user && !isSignup) return this.addError('UserDoesNotExistsErrorType')
      else if (!user) {
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
          username: username,
          lastName: lastName,
          firstName: firstName,
          loggedIn: true,
          signInMethod: SIGN_IN_METHOD.FACEBOOK,
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

        const emailVerificationToken = jwt.sign({ userId: newUser.id, type: JWT_TOKEN_TYPES.VERIFY_EMAIL, date: new Date() }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiry })
        sendEmail({ email: newUser.email, firstName: newUser.username, verificationLink: `${appConfig.app.userFeUrl}/verify-email?token=${emailVerificationToken}`, url: appConfig.app.userFeUrl, supportEmail: 'noreply@phibet.com' })

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
        Promise.all([AvailJoiningBonusAndZeroVipLevelService.execute({ userDetails: newUser, referralCode, levelZero })])
        const getBonus = await GetDailyBonusService.execute({ userId: newUser.id }, this.context)

        return {
          success: true,
          user: newUser.dataValues,
          activeBonus: getBonus?.result,
          getWelcomePackage: getWelcomePackage?.result || null
        }
      }

      if (user.userLimit.value === SELF_EXCLUSION_TYPES.PERMANENT) return this.addError('ExcludedPermanentlyPleaseContactProviderErrorType')
      if (user.userLimit.value === SELF_EXCLUSION_TYPES.TEMPORARY && !dayjs().isAfter(user.userLimit.expireAt)) return this.addError('SelfExcludedErrorType')
      await CheckAndUpdateAllLimits.execute({ userId: user.id, limit: user.userLimit, isActive: user.isActive, activity: true }, this.context)

      user.loggedIn = true
      user.loggedInAt = new Date()
      user.lastLoggedInIp = ipAddress
      user.signInMethod = SIGN_IN_METHOD.FACEBOOK
      await user.save({ transaction })

      await CreateUserAcitivityService.execute({ userId: user.id, activityType: USER_ACTIVITY.LOGIN }, this.context)
      const getBonus = await GetDailyBonusService.execute({ userId: user.id }, this.context)
      const getWelcomePackage = await GetWelcomePackageService.execute({}, this.context)
      if (getWelcomePackage?.result?.welcomePackage) {
        const time = moment(user.createdAt).add(getWelcomePackage?.result?.welcomePackage?.timer, 'hours').format()
        if (moment().format() > time) getWelcomePackage.result = { welcomePackage: null }
      }

      return { user, activeBonus: getBonus?.result, getWelcomePackage: getWelcomePackage?.result || null }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
