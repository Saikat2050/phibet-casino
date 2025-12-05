import { sequelize } from '../../db/models'
import { pageValidation, prepareImageUrl } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'

export default class GetRecentlyPlayedGames extends ServiceBase {
  async run () {
    const { id } = this.args
    const {
      dbModels: {
        User: UserModel,
        MasterCasinoGame: MasterCasinoGameModel,
        CasinoTransaction: CasinoTransactionModel,
        MasterGameAggregator: MasterGameAggregatorModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel,
        FavoriteGame: FavoriteGameModel
      }
    } = this.context

    const { page, limit } = this.args
    const { pageNo, size } = pageValidation(page, limit)
    try {
      const activeProviders = (
        await MasterCasinoProviderModel.findAll({
          where: {
            isActive: true
          },
          include: [
            {
              model: MasterGameAggregatorModel,
              where: {
                isActive: true
              },
              required: true
            }
          ],
          attributes: ['masterCasinoProviderId', 'isActive']
        })
      ).map(x => {
        return x.masterCasinoProviderId
      })

      const games = await CasinoTransactionModel.findAll({
        where: sequelize.literal(
          `("game_identifier", casino_transaction_id) IN (
            SELECT "game_identifier", MAX(casino_transaction_id) 
            FROM "casino_transactions" 
            WHERE user_id = ${id}
            GROUP BY "game_identifier")`
        ),
        attributes: ['gameIdentifier', 'amount', 'userId', 'createdAt'],
        include: [
          {
            where: sequelize.literal(
              `master_casino_provider_id IN (${activeProviders}) AND ("master_casino_game_id") IN (
              SELECT "master_casino_game_id" 
              FROM "master_casino_games" 
              GROUP BY "master_casino_game_id")`
            ),
            attributes: ['masterCasinoGameId', 'name'],
            model: MasterCasinoGameModel,
            required: true,
            include: [
              {
                model: MasterCasinoGamesThumbnailModel
              },
              {
                model: FavoriteGameModel,
                where: { userId: id },
                required: false
              }
            ]
          },
          {
            attributes: ['userId', 'firstName', 'lastName', 'email'],
            model: UserModel,
            required: true
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: (pageNo - 1) * size
      })

      const uniqueMasterCasinoGameIds = {}
      const filteredGames = []

      for (let i = 0; i < games.length; i++) {
        const masterCasinoGameId =
          games[i]?.MasterCasinoGame?.masterCasinoGameId

        if (!uniqueMasterCasinoGameIds[masterCasinoGameId]) {
          uniqueMasterCasinoGameIds[masterCasinoGameId] = true
          filteredGames.push(games[i])
        }
      }

      await Promise.allSettled(
        filteredGames.map(async game => {
          game.dataValues.name = game?.MasterCasinoGame?.name
          game.dataValues.masterCasinoGameId =
            game?.MasterCasinoGame?.masterCasinoGameId
          game.dataValues.MasterCasinoGamesThumbnails =
            game?.MasterCasinoGame?.MasterCasinoGamesThumbnails
          game.dataValues.FavoriteGames =
            !!game?.MasterCasinoGame?.FavoriteGames.length
          delete game?.dataValues?.MasterCasinoGame
          await Promise.allSettled(
            game?.dataValues?.MasterCasinoGamesThumbnails.map(async image => {
              image.thumbnail = prepareImageUrl(image.thumbnail)
            })
          )
        })
      )

      return {
        success: true,
        data: {
          count: filteredGames.length,
          rows: filteredGames
        },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
