import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import bcrypt from 'bcrypt'
import { CheckAndUpdateAllLimits } from '../responsibleGambling/checkAndUpdateAllLimits.service'
import { CreateUserAcitivityService } from './createUserActivity'
import { GetUserActivityService } from './getUserActivity'
import { LOGIN_FAILURE_TIME_SPAN, SELF_EXCLUSION_TYPES, SIGN_IN_METHOD, USER_ACTIVITY } from '@src/utils/constants/public.constants.utils'
import { GetDailyBonusService } from '../bonus/getDailyBonus.service'
import { GetWelcomePackageService } from '@src/services/bonus/getWelcomePackage.service'
import { dayjs } from '@src/libs/dayjs'
import { Op } from 'sequelize'
import { GetJoiningBonusService } from '../bonus/getJoiningBonus.service'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
const moment = require('moment-timezone')

const constraints = ajv.compile({
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    ipAddress: { type: 'string' },
    otp: { type: 'string' }
  },
  required: ['email', 'password', 'ipAddress']
})

export class LoginService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { email: this.args.email },
        include: [{
          model: this.context.sequelize.models.wallet,
          separate: true,
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.currency,
            where: { isActive: true },
            required: true
          }
        }, {
          attributes: ['key', 'value', 'expireAt', 'id'],
          model: this.context.sequelize.models.userLimit,
          required: true
        }, {
          model: this.context.sequelize.models.address,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }, {
          model: this.context.sequelize.models.userBonus,
          attributes: ['id', 'userId', ['created_at', 'last_spin_date']],
          where: { moreDetails: { [Op.contains]: { type: 'spinWheel' } } },
          order: [['createdAt', 'DESC']],
          limit: 1,
          required: false
        }],
        attributes: { exclude: ['phoneOtp'] }
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!user.isActive) return this.addError('UserInactiveErrorType')

      if (!this.args.otp) {
        // if (!user.emailVerified) return this.addError('EmailNotVerifiedErrorType')

        const passwordMatch = await bcrypt.compare(this.args.password, user.password)
        if (!passwordMatch) {
          const { result: users } = await GetUserActivityService.execute({ userId: user.id, timeSpan: LOGIN_FAILURE_TIME_SPAN, limit: 2 }, this.context)
          if (users.length === 2 && users.every((user) => user.activityType === USER_ACTIVITY.LOGIN_FAILURE)) {
            // TODO
            // await SendOtpService.execute({email:user.email},this.context);
            return this.addError('LoginAttemptsExhausted')
          } else {
            await CreateUserAcitivityService.execute({ userId: user.id, activityType: USER_ACTIVITY.LOGIN_FAILURE }, this.context)
            return this.addError('WrongPasswordErrorType')
          }
        }
      } else {
        // const { result: otpDetails } = await VerifyOtpService.execute({ email: user.email, otp: this.args.otp }, this.context);
        // if (!otpDetails) {
        return this.addError('InvalidOtpErrorType')
        // }
      }

      if (user.userLimit.value === SELF_EXCLUSION_TYPES.PERMANENT) return this.addError('ExcludedPermanentlyPleaseContactProviderErrorType')
      if (user.userLimit.value === SELF_EXCLUSION_TYPES.TEMPORARY && !dayjs().isAfter(user.userLimit.expireAt)) return this.addError('SelfExcludedErrorType')
      await CheckAndUpdateAllLimits.execute({ userId: user.id, limit: user.userLimit, isActive: user.isActive, activity: true }, this.context)

      user.loggedIn = true
      user.loggedInAt = new Date()
      user.lastLoggedInIp = this.args.ipAddress
      user.signInMethod = SIGN_IN_METHOD.EMAIL
      await user.save()
      await CreateUserAcitivityService.execute({ userId: user.id, activityType: USER_ACTIVITY.LOGIN }, this.context)

      const getBonus = await GetDailyBonusService.execute({ userId: user.id }, this.context)

      const getWelcomePackage = await GetWelcomePackageService.execute({}, this.context)

      if (getWelcomePackage?.result?.welcomePackage) {
        const time = moment(user.createdAt).add(getWelcomePackage?.result?.welcomePackage?.timer, 'hours').format()
        if (moment().format() > time) getWelcomePackage.result = { welcomePackage: null }
      }

      const welcomeBonus = await GetJoiningBonusService.execute({ userId: user.id }, this.context)
      const amoeBonus = await await this.context.sequelize.models.bonus.findOne({
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

      return { user, activeBonus: getBonus.result, getWelcomePackage: getWelcomePackage?.result || null, welcomeBonus: welcomeBonus?.result, amoeBonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
