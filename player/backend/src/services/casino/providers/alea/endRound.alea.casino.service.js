import { Logger } from '@src/libs/logger'
import { verifySignature } from './alea.helper'
import ServiceBase from '@src/libs/serviceBase'
import { BetAleaCasinoService } from './bet.alea.casino.service'
import { WinAleaCasinoService } from './win.alea.casino.service'
import { RollBackAleaCasinoService } from './rollback.alea.casino.service'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { ALEA_ERROR_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'

export class EndRoundAleaCasinoService extends ServiceBase {
  async run () {
    const transaction = this.context.sequelizeTransaction

    try {
      if (+this.args.amount < 0) return ALEA_ERROR_TYPES.TRANSACTION_ALREADY_PROCESSED
      if (!verifySignature(this.args)) return ALEA_ERROR_TYPES.INVALID_SIGNATURE

      const casinoTransaction = await this.context.sequelize.models.casinoTransaction.findOne({
        where: { roundId: this.args.round.id },
        include: {
          model: this.context.sequelize.models.ledger,
          as: 'casinoLedger',
          attributes: ['purpose', 'amount']
        },
        attributes: ['status', 'transactionId'],
        transaction
      })

      if (casinoTransaction?.casinoLedger?.[0]?.purpose === LEDGER_PURPOSE.CASINO_BET) {
        const result = await BetAleaCasinoService.execute({ ...this.args, id: casinoTransaction.transactionId, endRound: true, amount: casinoTransaction.casinoLedger[0].amount }, this.context)
        return result.result
      } else if (casinoTransaction?.casinoLedger?.[0]?.purpose === LEDGER_PURPOSE.CASINO_WIN) {
        const result = await WinAleaCasinoService.execute({ ...this.args, id: casinoTransaction.transactionId, endRound: true, amount: casinoTransaction.casinoLedger[0].amount }, this.context)
        return result.result
      } else if ([LEDGER_PURPOSE.CASINO_BET_ROLLBACK, LEDGER_PURPOSE.CASINO_WIN_ROLLBACK, LEDGER_PURPOSE.CASINO_REFUND].includes(casinoTransaction?.casinoLedger?.[0]?.purpose)) {
        const result = await RollBackAleaCasinoService.execute({ ...this.args, id: casinoTransaction.transactionId, endRound: true, amount: casinoTransaction.casinoLedger[0].amount }, this.context)
        return result.result
      } else return ALEA_ERROR_TYPES.END_ROUND_ERROR
    } catch (error) {
      Logger.error(`Error in Alea End Round Service - ${error}`)
      const transactionStatuses = ['commit', 'rollback']
      if (!(~transactionStatuses.indexOf(transaction.finished))) { await transaction.rollback() }
      return ALEA_ERROR_TYPES.INTERNAL_ERROR
    }
  }
}
