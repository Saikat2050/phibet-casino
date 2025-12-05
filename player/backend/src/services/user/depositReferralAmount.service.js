import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: { referralCode: { type: 'string' } },
  required: ['referralCode']
})

export class DepositReferralAmountService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const referralUser = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'emailVerified', 'isActive'],
        where: { uniqueId: this.args.referralCode, isActive: true }
      })
      if (!referralUser) return this.addError('InvalidReferralCodeErrorType')

      const referralLimitCount = await this.context.sequelize.models.user.count({ col: 'id', where: { referredBy: referralUser?.id } })
      const referralData = await this.context.sequelize.models.setting.findOne({ where: { key: SETTING_KEYS.REFERRAL } })
      const dataValue = JSON.parse(referralData.value)

      if (!dataValue.isActive) return this.addError('ReferralInActiveErrorType')
      if ((referralLimitCount >= dataValue.limit)) return this.addError('ReferralLimitExceededErrorType')

      return referralUser.id
    } catch (error) {
      return this.addError('InvalidReferralCodeErrorType')
    }
  }
}
