import ServiceBase from '../serviceBase'
import { scSum } from '../../utils/common'
import { minus, round } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import WalletEmitter from '../../socket-resources/emitter/wallet.emitter'
import { ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS } from '../../utils/constants/constant'
import InsufficientBalanceEmitter from '../../socket-resources/emitter/insufficientBalance.emitter'

export class JoinTournamentService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail }
      },
      dbModels: {
        Wallet: WalletModel,
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { tournamentId } = this.args

    const userId = detail.userId
    let socketObj = {}
    let moreDetails = {}
    let beforeBalance
    let afterBalance

    try {
      const tournament = await TournamentModel.findOne({
        where: { tournamentId }
      })

      if (!tournament) {
        return this.addError('TournamentNotExistErrorType')
      }

      if (tournament.playerLimit) {
        const joinedUsers = await UserTournamentModel.count({
          where: {
            tournamentId
          }
        })

        if (+tournament.playerLimit <= +joinedUsers) return this.addError('TournamentIsClosedForFurtherRegistrationsErrorType')
      }

      const isUserAlreadyJoined = await UserTournamentModel.findOne({
        where: {
          tournamentId: tournament.tournamentId,
          userId: userId
        }
      })

      if (isUserAlreadyJoined) { return this.addError('UserAlreadyJoinedTournamentErrorType') }

      const { entryAmount, entryCoin, endDate } = tournament

      if (endDate <= new Date()) { return this.addError('TournamentFinishedErrorType') }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      const userBalance =
        entryCoin === 'SC' ? +scSum(userWallet) : +round(+userWallet.gcCoin, 2)

      if (entryAmount > +userBalance) {
        InsufficientBalanceEmitter.insufficientBalance({}, userId)
        return this.addError('InsufficientBalanceErrorType')
      }

      if (entryCoin === 'SC') {
        let remainingAmount = 0
        beforeBalance = +userBalance
        if (+userWallet.scCoin.psc >= +entryAmount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            psc: +round(+minus(+userWallet.scCoin.psc, +entryAmount), 2)
          }
          moreDetails.psc = +entryAmount
        } else {
          remainingAmount = +round(
            +minus(+entryAmount, +userWallet.scCoin.psc),
            2
          )
          moreDetails = { ...moreDetails, psc: +userWallet.scCoin.psc }
          userWallet.scCoin = { ...userWallet.scCoin, psc: 0 }

          if (+userWallet.scCoin.bsc >= +remainingAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              bsc: +round(+minus(+userWallet.scCoin.bsc, +remainingAmount), 2)
            }
            moreDetails = { ...moreDetails, bsc: +remainingAmount }
          } else {
            remainingAmount = +round(
              +minus(+remainingAmount, +userWallet.scCoin.bsc),
              2
            )
            moreDetails = { ...moreDetails, psc: +userWallet.scCoin.bsc }
            userWallet.scCoin = { ...userWallet.scCoin, bsc: 0 }

            if (+userWallet.scCoin.wsc < +remainingAmount) {
              InsufficientBalanceEmitter.insufficientBalance(socketObj, userId)
              return this.addError('InsufficientBalanceErrorType')
            }
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +round(+minus(+userWallet.scCoin.wsc, +remainingAmount), 2)
            }
            moreDetails = { ...moreDetails, wsc: +remainingAmount }
          }
        }
        afterBalance = +round(+minus(+userBalance, +entryAmount), 2)
        socketObj = {
          ...socketObj,
          bsc: +round(+userWallet.scCoin.bsc, 2),
          wsc: +round(+userWallet.scCoin.wsc, 2),
          scCoin: +scSum(userWallet)
        }
      } else {
        beforeBalance = +userBalance
        afterBalance = +round(+minus(+userBalance, +entryAmount), 2)
        userWallet.gcCoin = +round(+minus(+userBalance, +entryAmount), 2)
        moreDetails.gcCoin = +entryAmount
        socketObj.gcCoin = +round(+userWallet.gcCoin, 2)
      }

      await userWallet.save({ transaction })

      await UserTournamentModel.create(
        {
          tournamentId: tournament.tournamentId,
          userId,
          totalWin: 0,
          isCompleted: false,
          isWinner: false
        },
        { transaction }
      )

      await CasinoTransactionModel.create(
        {
          transactionId: `${new Date(
            new Date().toString().split('GMT')[0] + ' UTC'
          ).toISOString()}-TRANSACTION`,
          userId: detail.userId,
          actionType: 'tournament',
          actionId: ACTION_TYPE.DEBIT,
          amount: +entryAmount,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          sc: entryCoin === 'SC' ? +entryAmount : 0,
          gc: entryCoin === 'SC' ? 0 : +entryAmount,
          beforeBalance,
          afterBalance,
          amountType:
            entryCoin === 'SC' ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
          status: TRANSACTION_STATUS.SUCCESS,
          moreDetails,
          roundId: 'NULL'
        },
        { transaction }
      )

      WalletEmitter.emitUserWalletBalance(socketObj, userId)

      return {
        message: SUCCESS_MSG.CREATE_SUCCESS,
        success: true
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
