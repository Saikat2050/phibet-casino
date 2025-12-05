import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
// import { CreateLedgerService } from '../ledger/createLedger.service'
import ServiceBase from '@src/libs/serviceBase'
// import _ from 'lodash'
import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    welcomeBonus: { type: 'object' },
    userId: { type: 'number' },
    requiredCheckFlag: { type: 'string' }
  },
  required: ['userId', 'welcomeBonus', 'requiredCheckFlag']
})

export class ProcessJoiningBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { welcomeBonus, userId, requiredCheckFlag } = this.args
      const transaction = this.context.sequelizeTransaction
      const txn = await this.context.sequelize.models.transaction.create(
        {
          userId,
          status: TRANSACTION_STATUS.COMPLETED
        },
        { transaction }
      )

      await this.context.sequelize.models.userBonus.create(
        {
          bonusId: welcomeBonus.id,
          userId,
          transactionId: txn.id,
          status: USER_BONUS_STATUS_VALUES.PENDING,
          moreDetails: requiredCheckFlag === 'isEmailVerified' ? { byEmailVerified: true } : { byPurchaseRequired: true }
        },
        { transaction }
      )
      return { status: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
