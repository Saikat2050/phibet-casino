import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { CreateWalletService } from '@src/services/user/createWallet.service'
import { EMAIL_TEMPLATE_EVENT_TYPES, KYC_STATUS, USER_GENDER } from '@src/utils/constants/public.constants.utils'
import bcrypt from 'bcrypt'
import { CACHE_KEYS, JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import { Cache } from '@src/libs/cache'
import jwt from 'jsonwebtoken'
import { GetWelcomePackageService } from '../bonus/getWelcomePackage.service'
import { GetScaleoAffiliateDetailService } from '../common/getScaleoAffiliateDetail.service'
import _ from 'lodash'
import { dayjs } from '@src/libs/dayjs'
import { populateUserDetails } from '@src/helpers/populateLocalCache.helper'
// import { SendgridAxios } from '@src/libs/axios/sendgrid.axios'
import { AvailJoiningBonusAndZeroVipLevelService } from './commonAvailCoins.service'
// import { Logger } from '@src/libs/logger'
import { GetDailyBonusService } from '../bonus/getDailyBonus.service'
import { ScaleoAxios } from '@src/libs/axios/scaleo.axios'
import { SendEmailService } from '../emailTemplate/sendMail.service'
import { GetJoiningBonusService } from '../bonus/getJoiningBonus.service'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { Op } from 'sequelize'
const moment = require('moment-timezone')

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' },
    phone: { type: 'string' },
    username: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneCode: { type: 'string' },
    dateOfBirth: { type: 'string' },
    password: { type: 'string' },
    gender: { enum: Object.values(USER_GENDER) },
    ipAddress: { type: 'string' },
    referralCode: { type: 'string' },
    affiliateCode: { type: 'string' },
    affiliateId: { type: 'string' }
  },
  required: ['email', 'password', 'ipAddress']
})

export class SignupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const userModel = this.context.sequelize.models.user
    let { affiliateCode, affiliateId, ipAddress, referralCode } = this.args

    try {
      const { result: { country, state } } = await GetIpLocationService.execute({ ipAddress }, this.context)
      const user = await userModel.findOne({ where: { email: this.args.email }, attributes: ['id'], transaction })
      if (user) return this.addError('UsernameOrEmailAlreadyExistsErrorType')

      const uuidRegexV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (referralCode && !uuidRegexV4.test(referralCode)) referralCode = ''

      const affiliateResult = (referralCode || !affiliateCode || !affiliateId) ? false : await GetScaleoAffiliateDetailService.execute({ affiliateCode, affiliateId }, this.context)
      if (_.size(affiliateResult.errors)) return this.mergeErrors(affiliateResult?.errors)
      else if (!affiliateResult?.result?.success) affiliateCode = affiliateId = null
      else affiliateCode = affiliateCode.replaceAll('-', '')

      const encryptedPassword = await bcrypt.hash(this.args.password, appConfig.bcrypt.salt)
      const userData = {
        kycStatus: KYC_STATUS.PENDING,
        countryId: country.id,
        email: this.args.email,
        lastLoggedInIp: ipAddress,
        password: encryptedPassword,
        username: this.args.username || `${this.args.email.split('@')[0]}_${Math.random().toString(36).substring(2, 6)}${Math.floor(Math.random() * 10)}`,
        phone: this.args.phone || null,
        gender: this.args.gender || USER_GENDER.UNKNOWN,
        lastName: this.args.lastName || null,
        firstName: this.args.firstName || null,
        phoneCode: this.args.phoneCode || null,
        dateOfBirth: this.args.dateOfBirth || null,
        loggedIn: true,
        affiliateCode,
        affiliateId
      }

      const newUser = await userModel.create(userData, { transaction })
      const currencies = await this.context.sequelize.models.currency.findAll({ raw: true, transaction })
      newUser.limits = await this.context.sequelize.models.userLimit.createAll(newUser.id, { transaction })

      newUser.wallets = await Promise.all(currencies.map(async (currency) => {
        const wallet = await CreateWalletService.execute({ userId: newUser.id, currencyId: currency.id, isDefault: currency.isDefault }, this.context)
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
      await this.context.sequelize.models.userVipTier.create({ userId: newUser.id, vipLevelId: levelZero?.id }, { transaction })

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

      // const emailVerificationToken = jwt.sign({ userId: newUser.id, type: JWT_TOKEN_TYPES.VERIFY_EMAIL, date: new Date() }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiry })

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
      const joiningBonus = await GetJoiningBonusService.execute({}, this.context)
      const amoeBonus = await this.context.sequelize.models.bonus.findOne({
        where: {
          bonusType: BONUS_TYPES.AMOE_CODE,
          isActive: true
        },
        include: {
          model: this.context.models.bonusCurrency,
          include: {
            model: this.context.models.currency,
            where: { code: { [Op.in]: ['GC', 'BSC'] } },
            required: true
          }
        }
      })

      return {
        success: true,
        user: { ...newUser.dataValues, userBonus: [] },
        joiningBonus: joiningBonus?.result,
        activeBonus: getBonus?.result,
        getWelcomePackage: getWelcomePackage?.result || null,
        amoeBonus
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
