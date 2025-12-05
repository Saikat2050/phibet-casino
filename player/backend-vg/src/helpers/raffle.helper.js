import { Op } from 'sequelize'
import { minus, divide } from 'number-precision'
import models, { sequelize } from '../db/models'
import {
  ACTION_TYPE,
  AMOUNT_TYPE,
  CASINO_ACTION_TYPE,
  CASINO_TRANSACTION_STATUS
} from '../utils/constants/constant'

export const raffleHelper = async (userId) => {
  const {
    User: UserModel,
    Raffles: RafflesModel,
    RafflesEntry: RafflesEntryModel,
    CasinoTransaction: CasinoTransactionModel
  } = models

  const isInternalUser = await UserModel.findOne({ where: { isInternalUser: true, userId } })

  if (isInternalUser) return { success: true, message: 'Test User' }

  const currentDate = new Date()

  const raffleDetail = await RafflesModel.findOne({
    where: {
      startDate: { [Op.lte]: currentDate },
      endDate: { [Op.gte]: currentDate },
      isActive: true
    }
  })

  if (!raffleDetail) return { success: true, message: 'Raffle Not found' }

  const betSum =
    (await CasinoTransactionModel.sum('amount', {
      where: {
        userId: userId,
        actionType: CASINO_ACTION_TYPE.BET,
        actionId: ACTION_TYPE.DEBIT,
        status: CASINO_TRANSACTION_STATUS.COMPLETED,
        amountType: raffleDetail.wagerBaseAmtType === 'SC' ? AMOUNT_TYPE.SC_COIN : AMOUNT_TYPE.GC_COIN,
        createdAt: {
          [Op.between]: [raffleDetail.startDate, raffleDetail.endDate]
        },
        tournamentId: null
      }
    })) ?? 0

  const noOfAcquiredTickets =
    (await RafflesEntryModel.count({
      where: {
        raffleId: raffleDetail.raffleId,
        userId: userId,
        isActive: true
      }
    })) ?? 0

  const noOfTickets = Math.floor(+divide(+betSum, +raffleDetail.wagerBaseAmt))

  const ticketsToAvail = Math.max(0, +minus(+noOfTickets, +noOfAcquiredTickets))

  const entries = []
  for (let i = 0; i < ticketsToAvail; i++) {
    entries.push({
      raffleId: raffleDetail.raffleId,
      userId,
      isActive: true
    })
  }

  if (entries.length > 0) {
    const raffleTransaction = await sequelize.transaction()
    try {
      await RafflesEntryModel.bulkCreate(entries, {
        transaction: raffleTransaction
      })
      await raffleTransaction.commit()
    } catch (error) {
      console.log('Error in Raffle helper', error)
      await raffleTransaction.rollback()
      return { success: false, message: 'InternalServerErrorType' }
    }
  }
  return true
}
