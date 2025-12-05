import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { JackpotQueue, JOB_JACKPOT_UPDATE } from '@src/queues/jackpot.queue'
import { emitUserWallet } from '@src/socket-resources/emitters/wallet.emitter'
import { LEDGER_PURPOSE, SWEEPS_COINS, JACKPOT_STATUS } from '@src/utils/constants/public.constants.utils'
import { CreateLedgerService } from '../common/createLedger.service'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'
import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants'
import _, { round, times, divide } from 'lodash'
import { pubSubRedisClient } from '@src/libs/pubSubRedisClient'
import { emitAdminEndJackpotNotification, emitUserEndJackpotNotification } from '@src/socket-resources/emitters/jackpotNotification.emmitter'
import { minus, plus } from 'number-precision'

export class UpdateJackpotDataService extends ServiceBase {
  async run () {
    try {
      const { userId, gameId, jackpotMultiplier = 1 } = this.args
      const sequelizeTransaction = this.context.sequelizeTransaction
      const WalletModel = this.context.sequelize.models.wallet
      const JackpotModel = this.context.sequelize.models.jackpot
      const CasinoTransactionModel = this.context.sequelize.models.casinoTransaction

      const [userWallet, jackpotData] = await Promise.all([
        await WalletModel.findAll({
          where: { userId },
          include: {
            model: this.context.sequelize.models.currency,
            attributes: ['code', 'type'],
            where: { type: 'sweep-coin' },
            required: true
          },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: this.context.sequelize.models.wallet },
          transaction: sequelizeTransaction
        }),
        JackpotModel.findOne({
          where: { status: JACKPOT_STATUS.RUNNING },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: JackpotModel },
          transaction: sequelizeTransaction
        })
      ])
      if (!userWallet) return this.addError('InvalidWalletIdErrorType')
      if (!jackpotData) return this.addError('JackpotNotFoundErrorType')
      const totalBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)
      let ticketsToCreate = +jackpotMultiplier
      if (+plus(+jackpotData.ticketSold, +jackpotMultiplier) >= +jackpotData.winningTicket) {
        ticketsToCreate = +minus(+jackpotData.winningTicket, +jackpotData.ticketSold)
        const leftTickets = +minus(+jackpotMultiplier, +ticketsToCreate)
        // create new job for the left ones, so those can be catered in next jackpot.
        await JackpotQueue.add(JOB_JACKPOT_UPDATE, { gameId, userId, jackpotId: jackpotData.jackpotId, jackpotMultiplier: +leftTickets })
      }
      if (+totalBalance < +times(+jackpotData.entryAmount, +ticketsToCreate)) {
      // finding the number of tickets that can be created
        ticketsToCreate = +Math.floor(+divide(+totalBalance, +jackpotData.entryAmount))

        if (+ticketsToCreate === 0) return this.addError('BalanceErrorType')
      }
      let lastBalance = +totalBalance
      const casinoTransaction = await CasinoTransactionModel.create({
        userId,
        gameId,
        transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`,
        metaData: {
          jackpotData,
          beforeBalance: lastBalance,
          afterBalance: lastBalance - (jackpotData.entryAmount * ticketsToCreate)
        },
        status: CASINO_TRANSACTION_STATUS.COMPLETED
      }, {
        transaction: sequelizeTransaction
      })
      for (let i = 0; i < +ticketsToCreate; i++) {
        let remainingAmount = +jackpotData.entryAmount

        lastBalance = NumberPrecision.minus(lastBalance, jackpotData.entryAmount)
        if (!casinoTransaction) return this.addError('CasinoTransactionCreationErrorType')
        const walletOrder = ['2', '3', '4']

        for (const currencyId of walletOrder) {
          const wallet = userWallet.find(w => w.currencyId === currencyId)
          if (wallet && remainingAmount > 0) {
            const deductionAmount = Math.min(remainingAmount, wallet.amount)
            if (deductionAmount > 0) {
              const { errors } = await CreateLedgerService.execute({
                amount: deductionAmount, transactionType: LEDGER_TRANSACTION_TYPE.CASINO, wallet, walletId: wallet.id, userId, purpose: LEDGER_PURPOSE.JACKPOT_ENRTY, transactionId: casinoTransaction.id, currencyId: wallet.currencyId
              }, this.context)
              if (_.size(errors)) return this.mergeErrors(errors)
              remainingAmount = NumberPrecision.minus(remainingAmount, deductionAmount)
            }
            if (remainingAmount <= 0) break
          }
        }
      }
      jackpotData.jackpotPoolAmount = +round(+plus(+jackpotData.jackpotPoolAmount, +times(+jackpotData.poolShare, +jackpotData.entryAmount, +ticketsToCreate)), 2)
      jackpotData.jackpotPoolEarning = +round(+plus(+jackpotData.jackpotPoolEarning, +times(+jackpotData.adminShare, +jackpotData.entryAmount, +ticketsToCreate)), 2)
      jackpotData.ticketSold = +round(+plus(+jackpotData.ticketSold, +ticketsToCreate), 0)
      emitAdminEndJackpotNotification({ jackpotPoolAmount: round(+jackpotData.jackpotPoolAmount, 2).toFixed(2), entryAmount: jackpotData.entryAmount.toFixed(2) })
      emitUserWallet(userWallet.userId, userWallet)
      await Promise.all([
        jackpotData.save({ transaction: sequelizeTransaction }),
        pubSubRedisClient.client.set('jackpot-details', JSON.stringify(jackpotData.get({ plain: true })))
      ])
      if (+jackpotData.ticketSold >= +jackpotData.winningTicket) {
        const res = await this.jackpotWinningProcedure({ jackpotEntryId: jackpotData.ticketSold, jackpotId: jackpotData.jackpotId, userWallet, userId, gameId })
        return res
      }

      return { success: true, message: 'Jackpot data updated successfully', data: { ticketsCreated: ticketsToCreate, jackpotId: jackpotData.jackpotId } }
    } catch (error) {
      throw new APIError(error)
    }
  }

  async jackpotWinningProcedure ({ jackpotEntryId, jackpotId, userWallet, userId, gameId }) {
    const {
      models: {
        Jackpot: JackpotModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction
    } = this.context

    // const adminNotificationQueue = adminNotifications()

    const jackpotData = await JackpotModel.findOne({
      where: { jackpotId: +jackpotId },
      lock: { level: sequelizeTransaction.LOCK.UPDATE, of: JackpotModel },
      transaction: sequelizeTransaction
    })

    await pubSubRedisClient.client.del('jackpot-details')
    const beforeBalance = userWallet.reduce((total, wallet) => NumberPrecision.plus(total, wallet.amount), 0)
    const afterBalance = +round(+plus(+beforeBalance, +jackpotData.jackpotPoolAmount), 2)

    // Jackpot Winning Notifications for winner
    emitUserWallet(userWallet.userId, userWallet)
    // Jackpot Winning Notification for admin
    emitAdminEndJackpotNotification({ jackpotFinished: true, winnerUserId: userId, jackpotWinAmount: +jackpotData.jackpotPoolAmount })
    // Need to add Admin Notification when jackpot is finished as well.
    // adminNotificationQueue.add(JOB_TRIGGER_ADMIN_NOTIFICATION, { jobType: 'JOB_TRIGGER_JACKPOT_WINNER_DETAILS', jackpotId: jackpotData.jackpotId }, { priority: 1, delay: 2000 })
    jackpotData.winningTicket = jackpotEntryId
    jackpotData.gameId = gameId
    jackpotData.endDate = new Date()
    jackpotData.status = JACKPOT_STATUS.COMPLETED
    jackpotData.userId = userId
    const [casinoTransaction] = await Promise.all([
      CasinoTransactionModel.create({
        userId,
        transactionId: `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString()}-TRANSACTION`,
        metaData: {
          jackpotData,
          beforeBalance,
          afterBalance
        },
        status: CASINO_TRANSACTION_STATUS.COMPLETED
      }, {
        transaction: sequelizeTransaction
      }),
      jackpotData.save({ transaction: sequelizeTransaction }),
      userWallet.save({ transaction: sequelizeTransaction })
    ])
    const wallet = userWallet.find(w => w.currency.code === SWEEPS_COINS.BSC)
    const { errors } = await CreateLedgerService.execute({
      amount: +jackpotData.jackpotPoolAmount, walletId: wallet.id, wallet: wallet, transactionType: LEDGER_TRANSACTION_TYPE.CASINO, userId, purpose: LEDGER_PURPOSE.JACKPOT_WIN, transactionId: casinoTransaction.id, currencyId: wallet.currencyId
    }, this.context)
    if (_.size(errors)) return this.mergeErrors(errors)
    // Enable New Jackpot
    const nextJackpot = await JackpotModel.findOne({
      where: { status: JACKPOT_STATUS.UPCOMING },
      order: [['createdAt', 'ASC']],
      transaction: sequelizeTransaction
    })

    if (!nextJackpot) {
      await pubSubRedisClient.client.del('jackpot-details')
      emitUserEndJackpotNotification({ jackpotPoolAmount: 0, newJackpot: false })
      return { success: true, message: 'Jackpot entry successful' }
    }

    nextJackpot.status = JACKPOT_STATUS.RUNNING
    nextJackpot.startDate = new Date()
    nextJackpot.ticketSold = 0
    await nextJackpot.save({ transaction: sequelizeTransaction })

    // Let users know the next jackpot has started
    emitUserEndJackpotNotification({ jackpotPoolAmount: round(+nextJackpot.jackpotPoolAmount, 2).toFixed(2), newJackpot: true, entryAmount: nextJackpot.entryAmount.toFixed(2) })

    pubSubRedisClient.client.set('jackpot-details', JSON.stringify(nextJackpot.get({ plain: true })))

    const isJackpotCreationNeeded = await JackpotModel.findOne({
      where: { status: JACKPOT_STATUS.UPCOMING },
      transaction: sequelizeTransaction
    })

    if (isJackpotCreationNeeded) {
      return {
        success: true,
        message: 'Jackpot Winner Declared, jackpot is not needed to be created.'
      }
    }
    // Create New Upcoming Jackpot
    const newWinningTicket = this.jackpotWinningTicketRnG(+nextJackpot.seedAmount, +nextJackpot.maxTicketSize, +round(+times(+nextJackpot.adminShare, +nextJackpot.entryAmount), 2))

    if (newWinningTicket === 'NO_JACKPOT_BREAK_EVEN') {
      return {
        success: true,
        message: 'Jackpot Winner Declared, jackpot couldn\'t be created.'
      }
    }
    await JackpotModel.create({
      jackpotName: nextJackpot.jackpotName,
      maxTicketSize: +nextJackpot.maxTicketSize,
      seedAmount: +nextJackpot.seedAmount,
      entryAmount: +nextJackpot.entryAmount,
      jackpotPoolAmount: +nextJackpot.seedAmount,
      jackpotPoolEarning: 0,
      adminShare: +nextJackpot.adminShare,
      poolShare: +nextJackpot.poolShare,
      winningTicket: +newWinningTicket,
      status: JACKPOT_STATUS.UPCOMING
    }, { transaction: sequelizeTransaction })

    return {
      success: true,
      message: 'Jackpot Winner Declared and new Jackpot Created.'
    }
  }

  jackpotWinningTicketRnG (seedAmount, maxTicketSize, adminShare) {
    let minTickets = +Math.ceil(+divide(+seedAmount, +adminShare || 1))

    if (+minTickets >= +maxTicketSize) return 'NO_JACKPOT_BREAK_EVEN'

    if (+divide(+maxTicketSize, 2) > +minTickets) minTickets = +Math.ceil(+divide(+maxTicketSize, 2))

    const min = minTickets + 1
    const max = +maxTicketSize

    if (max <= min) return 'NO_JACKPOT_BREAK_EVEN'

    const winningTicket = crypto.randomInt(min, max)
    return winningTicket
  }
}
