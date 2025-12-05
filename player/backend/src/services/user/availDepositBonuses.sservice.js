
import ServiceBase from '@src/libs/serviceBase'
import { plus, round, divide, times } from 'number-precision'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'

const schema = {
  type: 'object',
  properties: {
    transactionId: { anyOf: [{ type: 'number' }, { type: 'string' }] },
    userId: { anyOf: [{ type: 'number' }, { type: 'string' }] }
  },
  required: ['transactionId', 'userId']
}

const constraints = ajv.compile(schema)

export class AvailDepositBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { bonus: BonusModel, userActivity: UserActivityModel, transaction: TransactionModel } =
      this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction
    const { transactionId, userId } = this.args

    try {
      // 1️⃣ Get transaction details
      const transactionDetails = await TransactionModel.findOne({
        attributes: ['id', 'amount', 'userId'],
        where: { id: transactionId, userId },
        raw: true,
        transaction
      })

      if (!transactionDetails) {
        return this.addError('TransactionNotFoundErrorType')
      }

      // 2️⃣ Fetch deposit bonus configuration
      const depositBonus = await BonusModel.findOne({
        where: { bonusType:BONUS_TYPES.DEPOSIT, isActive: true },
        attributes: ['id', 'more_details'],
        raw: true,
        transaction
      })

      if (!depositBonus || !depositBonus.moreDetails?.deposits) {
        return this.addError('DepositBonusNotConfiguredErrorType')
      }

      const { deposits = [], maxDeposits } = depositBonus.moreDetails
      if (!deposits.length) {
        return this.addError('DepositBonusPartsMissingErrorType')
      }

      // 3️⃣ Count already availed deposit bonuses
      const bonusUsedCount = await UserActivityModel.count({
        where: {
          userId: String(userId),
          activityType: 'DEPOSIT_BONUS_APPLIED'
        },
        transaction
      })

      // 4️⃣ Check if user has exhausted all deposit bonuses
      if (bonusUsedCount >= maxDeposits) {
        return this.addError('AllDepositBonusesAvailedErrorType')
      }

      // 5️⃣ Pick correct bonus part
      const currentBonusConfig = deposits[bonusUsedCount]
      if (!currentBonusConfig) {
        return this.addError('DepositBonusConfigMissingErrorType')
      }

      // 6️⃣ Validate minimum deposit requirement
      if (
        currentBonusConfig.minimumDeposit &&
        transactionDetails.amount < currentBonusConfig.minimumDeposit
      ) {
        return this.addError('MinimumDepositNotMetErrorType')
      }

      // 7️⃣ Calculate bonus amount
      let bonusAmount
      if (currentBonusConfig.isPercentage) {
        bonusAmount = round(
          divide(times(transactionDetails.amount, currentBonusConfig.amount), 100),
          2
        )
      } else {
        bonusAmount = currentBonusConfig.amount
      }

      // 8️⃣ Prepare bonus details
      const completeBonusDetail = {
        bonusId: depositBonus.id,
        bonusName: currentBonusConfig.name,
        bonusPartNumber: bonusUsedCount + 1,
        depositAmount: transactionDetails.amount,
        bonusAmount,
        isPercentage: currentBonusConfig.isPercentage,
        minimumDeposit: currentBonusConfig.minimumDeposit
      }

      // 9️⃣ Record bonus usage
      await UserActivityModel.create(
        {
          userId: String(userId),
          activityType: 'DEPOSIT_BONUS_APPLIED',
          metaData: completeBonusDetail
        },
        { transaction }
      )

      return completeBonusDetail
    } catch (error) {
      return this.addError(
        'InternalServerErrorType',
        error.message || 'An internal server error occurred'
      )
    }
  }
}
