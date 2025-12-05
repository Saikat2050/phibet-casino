import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation, prepareImageUrl } from '../../utils/common'

export class GetAllTournamentService extends ServiceBase {
  async run () {
    let userId, pagination
    const query = { isActive: true }
    let userCheckNeeded = true
    const currentDate = new Date()

    const { page, limit } = this.args

    const token = this.context?.req?.headers?.cookie
      ?.split('accessToken=')[1]
      ?.split(';')[0]
    if (token) {
      try {
        const tokenPayload = jwt.verify(
          token,
          config.get('jwt.loginTokenSecret')
        )
        userId = tokenPayload?.id
      } catch (error) {}
    }

    const { pageNo, size } = pageValidation(page, limit)

    if (page && limit) {
      pagination = {
        limit: size,
        offset: (pageNo - 1) * size
      }
    }

    const [
      upcomingTournaments,
      runningTournaments,
      oldTournaments,
      joinedTournaments
    ] = await Promise.all([
      await this.getAllTournaments(
        this.context.dbModels,
        { ...query, startDate: { [Op.gt]: currentDate } },
        pagination,
        userId,
        userCheckNeeded
      ),
      await this.getAllTournaments(
        this.context.dbModels,
        {
          ...query,
          startDate: { [Op.lte]: currentDate },
          endDate: { [Op.gte]: currentDate }
        },
        pagination,
        userId,
        (userCheckNeeded = true)
      ),
      userId
        ? await this.getUserTournaments(
            this.context.dbModels,
            { userId },
            pagination,
            { endDate: { [Op.lt]: currentDate } }
          )
        : [],
      userId
        ? await this.getUserTournaments(
            this.context.dbModels,
            { isCompleted: false, userId },
            pagination
          )
        : []
    ])

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      data: {
        runningTournaments,
        upcomingTournaments,
        joinedTournaments,
        oldTournaments
      }
    }
  }

  async getAllTournaments (models, query, pagination, userId, userCheckNeeded) {
    const {
      Tournament: TournamentModel,
      UserTournament: UserTournamentModel,
      MasterCasinoGame: MasterCasinoGameModel,
      MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel
    } = models

    const tournamentDetails = await TournamentModel.findAndCountAll({
      where: query,
      ...pagination
    })

    if (tournamentDetails && tournamentDetails.rows) {
      tournamentDetails.rows = await Promise.all(
        tournamentDetails.rows.map(async tournament => {
          if (tournament.gameId) {
            tournament.gameId = await MasterCasinoGameModel.findAll({
              where: {
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
              ],
              attributes: ['masterCasinoGameId', 'name', 'isActive']
            })
          }

          if (userCheckNeeded) {
            tournament.dataValues.isJoined = false

            const isJoined = await UserTournamentModel.findOne({
              attributes: ['userTournamentId'],
              where: {
                tournamentId: tournament.tournamentId,
                userId
              }
            })

            if (isJoined) tournament.dataValues.isJoined = true
          } else {
            tournament.dataValues.isJoined = true
          }

          await Promise.all(tournament?.gameId.map(async game => {
            await Promise.all(game.MasterCasinoGamesThumbnails.map(x => {
              x.thumbnail = prepareImageUrl(x.thumbnail)
              return true
            }))
          }))

          return tournament
        })
      )
    }
    return tournamentDetails
  }

  async getUserTournaments (models, query, pagination, internalQuery) {
    const { UserTournament: UserTournamentModel } = models
    const userCheckNeeded = false

    const tournaments = (
      await UserTournamentModel.findAll({
        where: query
      })
    ).map(tournament => {
      return tournament.tournamentId
    })

    return await this.getAllTournaments(
      models,
      { tournamentId: { [Op.in]: tournaments }, ...internalQuery },
      pagination,
      null,
      userCheckNeeded
    )
  }
}
