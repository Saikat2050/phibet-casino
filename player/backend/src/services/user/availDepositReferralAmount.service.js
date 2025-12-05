import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import axios from 'axios'
import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
const { Op } = require('sequelize')
const moment = require('moment')

const constraints = ajv.compile({
  type: 'object',
  properties: { id: { type: 'string' }, referredTo: { type: 'string' } },
  required: ['id']
})

export class AvailDepositReferralAmountService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const referralUser = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'emailVerified', 'isActive'],
        where: { id: this.args.id, isActive: true },
        transaction
      })
      if (!referralUser) return

      // daily referral limit check
      const todayStart = moment().startOf('day').toDate()
      const todayEnd = moment().endOf('day').toDate()
      const referralLimitCount = await this.context.sequelize.models.user.count({
        col: 'id',
        where: {
          referredBy: this.args.id,
          createdAt: {
            [Op.between]: [todayStart, todayEnd]
          }
        }
      })
      const referralData = await this.context.sequelize.models.setting.findOne({ where: { key: SETTING_KEYS.REFERRAL }, transaction })
      const dataValue = JSON.parse(referralData.value)
      const currencies = dataValue.currency

      if (!dataValue.isActive) return
      if ((referralLimitCount > dataValue.limit)) return
      const { statusText } = await axios({
        url: `${appConfig.jobScheduler.jobSchedulerUrl}/avail-referral-deposit`,
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${appConfig.jobScheduler.jobSchedulerUsername}:${appConfig.jobScheduler.jobSchedulerPassword}`).toString('base64')}` },
        data: {
          currencies,
          userId: referralUser.id,
          referredTo: this.args.referredTo
        }
      })
      if (statusText !== 'OK') {
        throw new APIError('something went wrong while calling the job scheduler')
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
