import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { JACKPOT_STATUS } from '@src/utils/constants/app.constants'
import { divide, round, times } from 'lodash'
import { plus } from 'number-precision'
import { jackpotWinningTicketRnG } from '@src/utils/common'
import { Op } from 'sequelize'

export class CreateJackpotService extends ServiceBase {
  async run () {
    const { jackpotName, maxTicketSize, seedAmount, entryAmount, adminShare, poolShare } = this.args
    const {
      sequelizeTransaction: transaction
    } = this.context

    try {
      if (+plus(+adminShare, +poolShare) !== 100) return this.addError('InvalidJackpotShareErrorType')
      const winningTicket = jackpotWinningTicketRnG(seedAmount, maxTicketSize, +round(+times(+divide(+adminShare, 100), +entryAmount), 2))
      if (winningTicket === 'NO_JACKPOT_BREAK_EVEN') return this.addError('JackpotBreakEvenErrorType')
      const jackpot = await this.context.sequelize.models.jackpot.create({
        jackpotName,
        maxTicketSize,
        seedAmount,
        entryAmount,
        jackpotPoolAmount: +seedAmount,
        jackpotPoolEarning: 0,
        adminShare: +round(+divide(+adminShare, 100), 2),
        poolShare: +round(+divide(+poolShare, 100), 2),
        winningTicket: +winningTicket,
        status: JACKPOT_STATUS.UPCOMING,
        ticketSold: 0
      }, {
        transaction
      })
      const availableJackpotCount = this.context.sequelize.models.jackpot.count({ where: { status: { [Op.in]: [JACKPOT_STATUS.UPCOMING, JACKPOT_STATUS.RUNNING] } }, transaction })
      if (availableJackpotCount === 1) {
        const nextWinningTicket = jackpotWinningTicketRnG(seedAmount, maxTicketSize, entryAmount)
        await this.context.sequelize.models.jackpot.create({
          jackpotName,
          maxTicketSize,
          seedAmount,
          entryAmount,
          jackpotPoolAmount: +seedAmount,
          jackpotPoolEarning: 0,
          adminShare: +round(+divide(+adminShare, 100), 2),
          poolShare: +round(+divide(+poolShare, 100), 2),
          winningTicket: +nextWinningTicket,
          ticketSold: 0,
          status: JACKPOT_STATUS.UPCOMING
        }, { transaction })
      }

      return { jackpot }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
