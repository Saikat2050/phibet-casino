import { Op } from 'sequelize'
import db, { sequelize } from '../db/models'
import { AMOUNT_TYPE, CASINO_ACTION_TYPE, CASINO_TRANSACTION_STATUS } from '../utils/constants/constant'
import LeaderBoardEmitter from '../socket-resources/emitter/leaderBoard.emitter'

export async function tournamentHelper (userId, tournamentId) {
  const {
    User: UserModel,
    Tournament: TournamentModel,
    UserTournament: UserTournamentModel,
    CasinoTransaction: CasinoTransactionModel
  } = db

  const tournament = await TournamentModel.findOne({
    where: {
      tournamentId,
      startDate: { [Op.lt]: new Date() },
      endDate: { [Op.gt]: new Date() }
    }
  })

  if (!tournament) {
    throw new Error('NoTournamentFound')
  }

  const scWin = await CasinoTransactionModel.findOne({
    attributes: [
      sequelize.literal(
        'ROUND(COALESCE(SUM(CASE WHEN amount_type = 1 THEN amount END)::numeric, 0), 2) AS "scSum"'
      )
    ],
    where: {
      userId,
      tournamentId: tournament.tournamentId,
      actionType: CASINO_ACTION_TYPE.WIN,
      amountType: AMOUNT_TYPE.SC_COIN,
      status: CASINO_TRANSACTION_STATUS.COMPLETED,
      createdAt: {
        [Op.and]: {
          [Op.gte]: tournament.startDate,
          [Op.lte]: tournament.endDate
        }
      }
    },
    raw: true
  })

  const transaction = await sequelize.transaction()
  try {
    const userTournamentDetail = await UserTournamentModel.findOne({
      where: {
        tournamentId: tournament.tournamentId,
        userId
      },
      lock: { level: transaction.LOCK.UPDATE, of: UserTournamentModel },
      transaction
    })

    if (!userTournamentDetail) {
      throw new Error('UserIsNotRegisteredInThisTournament')
    }

    userTournamentDetail.score = +scWin.scSum

    await userTournamentDetail.save({ transaction })

    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    throw new Error('InternalServerErrorType')
  }

  const leaderBoard = await UserTournamentModel.findAll({
    attributes: ['tournamentId', 'userId', 'score'],
    where: {
      tournamentId: tournament.tournamentId
    },
    include: [
      {
        model: UserModel,
        attributes: ['username', 'email']
      }
    ],
    order: [['score', 'DESC']],
    raw: true
  })

  LeaderBoardEmitter.emitLeaderBoardEmitter(leaderBoard)
}

export async function checkTournamentId (tournamentId) {
  if (!tournamentId) return null

  const tournament = await db.Tournament.findOne({
    where: {
      tournamentId,
      startDate: { [Op.lt]: new Date() },
      endDate: { [Op.gt]: new Date() }
    }
  })

  return tournament?.tournamentId || null
}
