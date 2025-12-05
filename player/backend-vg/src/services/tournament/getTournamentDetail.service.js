import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { times, divide, round } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { prepareImageUrl } from '../../utils/common'

export class GetTournamentDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel
      }
    } = this.context

    const winnerPrizes = []
    let userId
    const { tournamentId } = this.args

    const token = this.context?.req?.headers?.cookie
      ?.split('accessToken=')[1]
      ?.split(';')[0]
    if (token) {
      try {
        const tokenPayload = jwt.verify(token, config.get('jwt.loginTokenSecret'))
        userId = tokenPayload?.id
      } catch (error) {}
    }

    const tournament = await TournamentModel.findOne({
      where: { tournamentId, isActive: true }
    })

    if (!tournament) return this.addError('TournamentNotExistErrorType')

    //  Game Images

    if (tournament.gameId) {
      tournament.gameId = await MasterCasinoGameModel.findAll({
        attributes: ['masterCasinoGameId', 'name', 'isActive'],
        where: {
          isActive: true,
          masterCasinoGameId: {
            [Op.in]: tournament.gameId
          }
        },
        include: [
          {
            attributes: ['thumbnail', 'thumbnailType'],
            model: MasterCasinoGamesThumbnailModel,
            required: false
          }
        ]
      })

      await Promise.all(tournament?.gameId.map(async game => {
        await Promise.all(game.MasterCasinoGamesThumbnails.map(x => {
          x.thumbnail = prepareImageUrl(x.thumbnail)
          return true
        }))
      }))
    }

    tournament.dataValues.isJoined = false

    if (userId) {
      const isJoined = await UserTournamentModel.findOne({
        attributes: ['userTournamentId'],
        where: {
          tournamentId: tournament.tournamentId,
          userId
        }
      })

      if (isJoined) tournament.dataValues.isJoined = true
    }

    // Winner Prize Calculation

    for (let i = 0; i < tournament.winnerPercentage.length; i++) {
      const percentage = tournament.winnerPercentage[i]

      winnerPrizes.push({
        scCoin: +round(+divide(times(+tournament.winSc, percentage), 100), 2),
        gcCoin: +round(+divide(times(+tournament.winGc, percentage), 100), 2)
      })
    }

    tournament.dataValues.winnerPrizes = winnerPrizes

    // LeaderBoard

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
      order: [['score', 'DESC']]
    })

    return {
      data: { tournamentDetails: tournament, leaderBoard },
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
