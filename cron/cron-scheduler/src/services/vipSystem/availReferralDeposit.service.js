import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { v4 as uuid } from 'uuid'
import { CreateTransactionService } from '../common/createTransaction.service'

export class AvailReferralDepositService extends ServiceBase {
  async run () {
    try {
      const transaction = this?.args?.seqTransaction || await sequelize.transaction()
      const { userId, currencies, referredTo } = this.args

      for (const currency of currencies) {
        const code = currency.code
        const amount = currency.coins

        // get the correct wallet based on code
        const wallet = await sequelize.models.wallet.findOne({
          where: { userId: userId },
          attributes: ['id'],
          include: {
            model: sequelize.models.currency,
            where: { code },
            attributes: ['id', 'code'],
            required: true
          },
          transaction
        })

        if (amount && amount !== 0) {
          await CreateTransactionService.execute({
            userId,
            paymentId: uuid(),
            amount,
            wallet,
            purpose: LEDGER_PURPOSE.REFERRAL_DEPOSIT,
            moreDetails: { referredTo }
          }, this.context)
        }

        if (!this?.args?.seqTransaction) await transaction.commit()
      }
    } catch (error) {

    }
  }
}
