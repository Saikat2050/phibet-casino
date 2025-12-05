import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import { NumberPrecision } from '@src/libs/numberPrecision'
import ServiceBase from '@src/libs/serviceBase'
import { TOURNAMENT_RESPONSE, TRANSACTION_PURPOSE, TRANSACTION_TYPE } from '@src/utils/constants/casinoTournament.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'number' },
    tournamentId: { type: 'number' },
    userId: { type: 'string' },
    transactionId: { type: 'string' },
    amount: { type: 'number' }
  },
  required: ['tournamentId', 'amount', 'transactionId', 'gameId']
})

export class TournamentWinService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userId = this.args.userId
    const transactionId = this.args.transactionId
    const tournamentId = this.args.tournamentId
    const amount = this.args.amount
    const gameId = (this.args.gameId).toString()
    const transaction = this.context.sequelizeTransaction
    try {
      const userTournament = await this.context.sequelize.models.userTournament.findOne({ where: { userId, tournamentId }, transaction })
      const tournamentGame = await this.context.sequelize.models.casinoTournamentGame.findOne({
        where: { tournamentId: tournamentId },
        include: {
          model: this.context.sequelize.models.casinoGame,
          where: { uniqueId: gameId }
        },
        transaction
      })
      if (!userTournament) return TOURNAMENT_RESPONSE.TOURNAMENT_NOT_FOUND
      if (!tournamentGame) return TOURNAMENT_RESPONSE.GAME_NOT_EXIST

      const existingTransaction = await this.context.sequelize.models.tournamentTransaction.findOne({ where: { transactionId, type: TRANSACTION_TYPE.CREDIT }, transaction })
      if (existingTransaction) return TOURNAMENT_RESPONSE.TRANSACTION_EXISTS
      userTournament.winPoints = NumberPrecision.round(NumberPrecision.plus(userTournament.winPoints, amount))
      await userTournament.save({ transaction })

      await this.context.sequelize.models.tournamentTransaction.create({
        userId,
        casinoGameId: tournamentGame.casinoGame.id,
        currencyId: userTournament.currencyId,
        points: amount,
        tournamentId: tournamentId,
        transactionId,
        type: TRANSACTION_TYPE.CREDIT,
        purpose: TRANSACTION_PURPOSE.WIN
      }, { transaction })
      return {
        userTournament,
        ...TOURNAMENT_RESPONSE.SUCCESS
      }
    } catch (error) {
      Logger.error('Error in tournament bet service', error)
      return TOURNAMENT_RESPONSE.INTERNAL_SERVER_ERROR
    }
  }
}
