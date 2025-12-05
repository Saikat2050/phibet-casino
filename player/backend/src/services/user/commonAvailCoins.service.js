import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { TierUpBonusService } from '../vipSystem/tierUpBonus.service'
import { sequelize } from '@src/database/models'
import { Logger } from '@src/libs/logger'
import { DepositReferralAmountService } from './depositReferralAmount.service'
import { JoiningBonusService } from '../bonus/joiningBonus.service'
import { CURRENCY_CODE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userDetails: { type: 'object' },
    levelZero: { type: 'object' },
    referralCode: { type: ['string', 'null'] }
  },
  required: ['userDetails']
})

export class AvailJoiningBonusAndZeroVipLevelService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userDetails, levelZero, referralCode } = this.args
    const transaction = await sequelize.transaction()

    try {
      const walletDetails = await sequelize.models.wallet.findAll({
        where: { userId: userDetails.id },
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

      Logger.info(`Level 0 details - ${JSON.stringify(levelZero)}`)
      if (levelZero?.tierUpBonus && !levelZero.xpRequirement) {
        Logger.info(`Adding level 0 bonus for user - ${userDetails.id}`)
        const gcCoins = levelZero.tierUpBonus.gc
        const scCoins = levelZero.tierUpBonus.sc

        await TierUpBonusService.execute({ userId: userDetails.id, gcCoins, scCoins, gcDetails, bscDetails }, { models: sequelize.models, sequelize, sequelizeTransaction: transaction })
      }

      if (referralCode) {
        try {
          const result = await DepositReferralAmountService.execute({ referralCode }, { models: sequelize.models, sequelize, sequelizeTransaction: transaction })
          userDetails.referredBy = result.result
          await userDetails.save({ transaction })
        } catch (error) {
          Logger.error(`Deposite referrel amount error user-id ${userDetails.id}`)
        }
      }

      try {
        await JoiningBonusService.execute({
          userId: userDetails.id,
          email: userDetails.email,
          emailVerified: userDetails.emailVerified,
          username: userDetails.username
        }, { models: sequelize.models, sequelize, sequelizeTransaction: transaction })
      } catch (error) {
        Logger.error(`Error in joining bonus in sign up ${error}`)
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }
}
