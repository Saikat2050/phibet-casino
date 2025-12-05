import { ServiceBase } from '@src/libs/serviceBase'
import { divide, round, times } from 'lodash'
import { minus, plus } from 'number-precision'
import { jackpotWinningTicketRnG } from '@src/utils/common'

export class GenerateRnGService extends ServiceBase {
  async run () {
    const { maxTicketSize, seedAmount, entryAmount, poolShare, adminShare } = this.args

    if (+plus(+adminShare, +poolShare) !== 100) return this.addError('InvalidJackpotShareErrorType')

    const winningTicket = jackpotWinningTicketRnG(seedAmount, maxTicketSize, +round(+times(+divide(+adminShare, 100), +entryAmount), 2))

    if (winningTicket === 'NO_JACKPOT_BREAK_EVEN') return this.addError('JackpotBreakEvenErrorType')

    return {
      maxTicketSize,
      seedAmount,
      entryAmount,
      poolShare,
      adminShare,
      winningTicket,
      jackpotEstEarning: +round(+times(+round(+times(+divide(+adminShare, 100), +entryAmount), 2), +winningTicket), 2),
      jackpotEstPool: +round(+plus(+times(+round(+times(+divide(+poolShare, 100), +entryAmount), 2), +winningTicket), +seedAmount), 2),
      jackpotEstRevenue: +round(+minus(+round(+times(+round(+times(+divide(+adminShare, 100), +entryAmount), 2), +winningTicket), 2), +seedAmount), 2)
    }
  }
}
