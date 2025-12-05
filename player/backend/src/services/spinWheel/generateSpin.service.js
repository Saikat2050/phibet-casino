import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreateTransactionService } from '@src/services/transaction/createTransaction.service'
import { CURRENCY_CODE, LEDGER_PURPOSE, SPIN_WHEEL_TIME_LIMIT_HOURS, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { generateSpinWheelIndex } from '@src/helpers/common.helper'
import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { sequelize } from '@src/database/models'
import { dayjs } from '@src/libs/dayjs'
import { PrepareWheelConfigurationService } from './prepareWheelConfiguration.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GenerateSpinService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      wheelDivisionConfiguration: wheelDivisionConfigurationModel,
      userBonus: userBonusModel
    } = this.context.sequelize.models
    const transaction = await sequelize.transaction()
    this.context.sequelizeTransaction = transaction
    const { userId } = this.args

    try {
      const wheelConfiguration = await wheelDivisionConfigurationModel.findAll({ order: [['wheelDivisionId', 'ASC']], raw: true })
      if (wheelConfiguration) {
        const lastSpinData = await userBonusModel.findOne({
          where: {
            userId: userId,
            moreDetails: { [Op.contains]: { type: 'spinWheel' } }
          },
          order: [['createdAt', 'DESC']],
          raw: true
        })
        if (lastSpinData) {
          const createdAt = dayjs(lastSpinData.createdAt)
          const diffHours = dayjs().diff(createdAt, 'hour')
          if (diffHours < SPIN_WHEEL_TIME_LIMIT_HOURS) {
            await transaction.commit()
            return this.addError('SpinWheelTimeLimitErrorType')
          }
        }

        const allowedWheelConfiguration = wheelConfiguration?.filter((config) => {
          if (config.isAllow) return config
        })

        const result = await PrepareWheelConfigurationService.execute({ wheelConfiguration: allowedWheelConfiguration }, this.context)
        const { object, index } = await generateSpinWheelIndex(result.result.wheelConfiguration)
        const userBonusData = {
          userId,
          status: USER_BONUS_STATUS_VALUES.CLAIMED,
          moreDetails: { wheelDivisionId: object.wheelDivisionId, type: 'spinWheel' }
        }

        const walletDetails = await sequelize.models.wallet.findAll({
          where: { userId },
          attributes: ['id'],
          include: [
            {
              model: sequelize.models.currency,
              where: { code: { [Op.in]: ['BSC', 'GC'] } },
              attributes: ['id', 'code']
            }
          ],
          transaction
        })

        if (!walletDetails || walletDetails.length === 0) return { success: true }

        const walletCurrencyMap = {}
        walletDetails.forEach((wallet) => {
          const currency = wallet.currency
          if (currency && currency.code) {
            walletCurrencyMap[currency.code] = {
              id: wallet.id,
              currencyId: currency.id
            }
          }
        })

        const gcDetails = walletCurrencyMap[CURRENCY_CODE.GC]
        const bscDetails = walletCurrencyMap[CURRENCY_CODE.BSC]

        if (object.sc) {
          const result = await CreateTransactionService.execute({
            userId,
            paymentId: uuid(),
            wallet: bscDetails,
            currencyId: bscDetails.currencyId,
            purpose: LEDGER_PURPOSE.SPIN_WHEEL_SC,
            amount: object.sc,
            code: SWEEPS_COINS.BSC,
            moreDetails: { wheelDivisionId: object.wheelDivisionId }
          }, this.context)
          if (_.size(result.errors)) {
            await transaction.rollback()
            return this.mergeErrors(result.errors)
          }
          userBonusData.moreDetails = { ...userBonusData.moreDetails, scTransactionId: result.id }
        }

        if (object.gc) {
          const result = await CreateTransactionService.execute({
            userId,
            paymentId: uuid(),
            purpose: LEDGER_PURPOSE.SPIN_WHEEL_GC,
            amount: object.gc,
            code: SWEEPS_COINS.GC,
            wallet: gcDetails,
            currencyId: gcDetails.currencyId,
            moreDetails: { wheelDivisionId: object.wheelDivisionId }
          }, this.context)
          if (_.size(result.errors)) {
            await transaction.rollback()
            return this.mergeErrors(result.errors)
          }
          userBonusData.moreDetails = { ...userBonusData.moreDetails, gcTransactionId: result.id }
        }

        await userBonusModel.create(userBonusData, { transaction })

        await transaction.commit()
        wheelConfiguration?.map((config, index) => {
          if (config.wheelDivisionId === object.wheelDivisionId) wheelConfiguration.index = index
          return null
        })
        return { wheelConfiguration: { sc: object.sc, gc: object.gc }, index: wheelConfiguration.index || index }
      }
    } catch (error) {
      await transaction.rollback()
      return { wheelConfiguration: null, index: -1 }
    }
  }
}
