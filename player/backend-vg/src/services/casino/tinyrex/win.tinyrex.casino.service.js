import { Op } from 'sequelize'
import ServiceBase from '../../serviceBase'
import { sequelize } from '../../../db/models'
import { plus, round } from 'number-precision'
import { ACTION, ACTION_TYPE, AMOUNT_TYPE, CASINO_TRANSACTION_STATUS, TRANSACTION_STATUS } from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
export class TinyrexWinService extends ServiceBase {
  async run() {
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        MasterCasinoGame: MasterCasinoGameModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction
    } = this.context

    const {
      amount,
      transactionId,
      userId,
      currencyCode,
      gameId,
      gameRoundCode: roundId
    } = this.args

    if (+amount < 0) {
      return {
        status: 422,
        code: 'bad.request',
        message: 'Amount is less than 0'
      }
    }

    const [game, user] = await Promise.all([
      MasterCasinoGameModel.findOne({
        attributes: ['masterCasinoGameId', 'identifier', ['name', 'gameName']],
        where: { identifier: gameId },
        transaction: sequelizeTransaction,
        raw: true
      }),
      UserModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: { userId: userId },
        transaction: sequelizeTransaction
      })
    ])

    if (!game) {
      return {
        status: 422,
        code: 'unknown.game',
        message: 'Launch alias not found'
      }
    }

    if (!user) {
      return {
        status: 422,
        code: 'player.not.found',
        message: 'Player is not found'
      }
    }

    try {
      const isScActive = currencyCode === 'SC'
      const [userWallet, checkTransaction] = await Promise.all([
        WalletModel.findOne({
          attributes: ['ownerId', 'totalScCoin', 'scCoin', 'gcCoin', 'walletId', 'currencyCode'],
          where: { ownerId: userId },
          lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
          transaction: sequelizeTransaction
        }),
        CasinoTransactionModel.findOne({
          attributes: ['casinoTransactionId', 'transactionId', 'roundId', 'roundStatus', 'actionType', 'status', 'gameId', 'sessionId', 'amount', 'moreDetails'],
          where: {
            userId,
            [Op.or]: [
              {
                actionType: [ACTION.WIN, ACTION.LOST],
                [Op.or]: [
                  { transactionId: `${transactionId}` },
                  { roundId: `${roundId}`, roundStatus: true }
                ]
              },
              { roundId: `${roundId}`, actionType: ACTION.BET }
            ]
          },
          transaction: sequelizeTransaction
        })
      ])

      const accountBalance = isScActive ? +round(+userWallet.totalScCoin, 2) : +round(+userWallet.gcCoin, 2)

      if (!checkTransaction ||
          (checkTransaction.transactionId === `${transactionId}` && checkTransaction.actionType === ACTION.BET) ||
          (checkTransaction.actionType !== ACTION.BET && !checkTransaction.roundStatus)) {
        await sequelizeTransaction.commit()

        if (!checkTransaction || checkTransaction.actionType !== ACTION.BET) {
          return {
            status: 422,
            code: 'invalid.casino.behaviour',
            message: 'Unexpected casino logic behavior'
          }
        } else {
          return {
            status: 422,
            code: 'invalid.transaction.id',
            message: 'Unexpected transaction id'
          }
        }
      }

      if (checkTransaction.roundId === `${roundId}` && checkTransaction.roundStatus) {
        await sequelizeTransaction.commit()
        return { balance: accountBalance }
      }

      checkTransaction.status = CASINO_TRANSACTION_STATUS.COMPLETED

      let beforeBalance = 0
      let afterBalance = 0
      const socketObj = {}
      const moreDetails = {
        bsc: 0,
        psc: 0,
        wsc: 0,
        requestJSONString: this.args?.rawBody
      }

      if (isScActive) {
        beforeBalance = +accountBalance
        afterBalance = +round(+plus(+beforeBalance, +amount), 2)
        userWallet.scCoin = {
          ...userWallet.scCoin,
          wsc: +round(+plus(+userWallet.scCoin.wsc, +amount), 2)
        }
        socketObj.scCoin = +afterBalance
        socketObj.wsc = +userWallet.scCoin.wsc
        socketObj.winDetails = {
          amount: +round(+amount, 2),
          gameId: game.masterCasinoGameId,
          gameName: game.gameName,
          currency: 'USD'
        }
        moreDetails.bscWin = (+checkTransaction?.moreDetails?.bsc * +amount) / +checkTransaction?.amount
      } else {
        beforeBalance = +accountBalance
        afterBalance = +round(+plus(+accountBalance, +amount), 2)
        userWallet.gcCoin = +afterBalance
        socketObj.gcCoin = +afterBalance
      }

      const transactionObj = {
        transactionId: `${transactionId}`,
        userId: userId,
        amount: +amount,
        gameId: game.masterCasinoGameId,
        roundId: roundId,
        gc: isScActive ? 0 : +amount,
        sc: isScActive ? +amount : 0,
        walletId: userWallet.walletId,
        currencyCode: userWallet.currencyCode,
        beforeBalance: beforeBalance,
        afterBalance: afterBalance,
        amountType: isScActive ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        device: 'desktop',
        gameIdentifier: gameId,
        status: TRANSACTION_STATUS.SUCCESS,
        roundStatus: true,
        moreDetails,
        actionType: +amount === 0 ? ACTION.LOST : ACTION.WIN,
        actionId: +amount === 0 ? ACTION_TYPE.LOST : ACTION_TYPE.CREDIT
      }

      await Promise.all([
        CasinoTransactionModel.create(transactionObj, { transaction: sequelizeTransaction }),
        userWallet.save({ transaction: sequelizeTransaction }),
        CasinoTransactionModel.update({ roundStatus: true }, { where: { roundId: `${roundId}` }, transaction: sequelizeTransaction }),
        checkTransaction.save({ transaction: sequelizeTransaction })
      ])

      await sequelizeTransaction.commit()
      WalletEmitter.emitUserWalletBalance(socketObj, userId)
      return { balance: +afterBalance }
    } catch (error) {
      console.log('Error in Win Service :', error)
      if (!['commit', 'rollback'].includes(sequelizeTransaction.finished)) await sequelizeTransaction.rollback()
      return {
        status: 422,
        code: 'error.internal',
        message: 'Internal error'
      }
    }
  }
}
