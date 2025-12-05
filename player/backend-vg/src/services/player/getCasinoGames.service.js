import jwt from 'jsonwebtoken'
import ServiceBase from '../serviceBase'
import { Op } from 'sequelize'
import { sequelize } from '../../db/models'
import config from '../../configs/app.config'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

export class GetCasinoGamesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        MasterCasinoGame: MasterCasinoGameModel,
        FavoriteGame: FavoriteGameModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      }
    } = this.context
    const { page, limit, search, masterCasinoProviderId } = this.args

    let userId

    const token = this.context?.req?.headers?.accesstoken
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
    const aggregators = await MasterGameAggregatorModel.findAll({
      where: {
        isActive: true
      },
      raw: true
    })
    const activeAggregators = []
    aggregators.map(x => {
      activeAggregators.push(x.masterGameAggregatorId)
      return true
    })
    const providers = await MasterCasinoProviderModel.findAll({
      where: {
        isActive: true,
        masterGameAggregatorId: { [Op.in]: activeAggregators }
      },
      raw: true
    })
    const activeProviders = []
    providers.map(x => {
      return activeProviders.push(x.masterCasinoProviderId)
    })
    const where = {
      isActive: true,
      masterCasinoProviderId: { [Op.in]: activeProviders }
    }
    if (+masterCasinoProviderId && +masterCasinoProviderId > 0) {
      where.masterCasinoProviderId = masterCasinoProviderId
    }
    if (search) {
      where.name = { [Op.iLike]: `%${search.trim()}%` }
    }

    // const games = await MasterCasinoGameModel.findAndCountAll({
    //   attributes: ['orderId', 'masterCasinoGameId', 'masterGameSubCategoryId', 'createdAt', 'identifier', 'masterCasinoProviderId', 'name', 'imageUrl'],
    //   where,
    //   raw: true,
    //   limit: size,
    //   offset: (pageNo - 1) * size
    // })

    // await Promise.all(
    //   games?.rows?.map(async (game) => {
    //     Object.assign(game, { FavoriteGames: false })
    //     if (userId) {
    //       const isFav = !!(await FavoriteGameModel.findOne({
    //         attributes: [sequelize.literal('1')],
    //         where: { userId: userId, masterCasinoGameId: game.masterCasinoGameId }
    //       }))
    //       game.FavoriteGames = isFav
    //     }
    //     return game
    //   })
    // )
    const gamesData = await MasterCasinoGameModel.findAndCountAll({
      attributes: [
        'orderId',
        'masterCasinoGameId',
        'masterGameSubCategoryId',
        'createdAt',
        'identifier',
        'masterCasinoProviderId',
        'name',
        'imageUrl'
      ],
      where,
      raw: true,
      limit: size,
      offset: (pageNo - 1) * size
    })
    
    const games = gamesData.rows
    const gameIds = games.map(game => game.masterCasinoGameId)
    
    // Initialize all games with FavoriteGames = false
    games.forEach(game => {
      game.FavoriteGames = false
    })
    
    if (userId) {
      const favoriteGames = await FavoriteGameModel.findAll({
        attributes: ['masterCasinoGameId'],
        where: {
          userId,
          masterCasinoGameId: { [Op.in]: gameIds }
        },
        raw: true
      })
    
      const favoriteGameIds = new Set(favoriteGames.map(fav => fav.masterCasinoGameId))
    
      // Update only those games that are favorites
      games.forEach(game => {
        if (favoriteGameIds.has(game.masterCasinoGameId)) {
          game.FavoriteGames = true
        }
      })
    }
    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      data: {
        count: gamesData.count,
        rows: games
      }
    }
  }
}
