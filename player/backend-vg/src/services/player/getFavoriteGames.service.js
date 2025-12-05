import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    page: {
      type: 'string',
      pattern: '^[0-9]+$'
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetFavoriteGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req: {
        user: {
          detail: { userId }
        }
      },
      dbModels: {
        FavoriteGame: FavoriteGameModel,
        // GameSubcategory: GameSubcategoryModel,
        MasterCasinoGame: MasterCasinoGameModel,
        // MasterGameCategory: MasterGameCategoryModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel,
        // MasterGameSubCategory: MasterGameSubCategoryModel,
        MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel
      }
    } = this.context
    const { page, limit } = this.args
    const { pageNo, size } = pageValidation(page, limit)

    const activeProviders = (await MasterCasinoProviderModel.findAll({
      attributes: ['masterCasinoProviderId'],
      where: {
        isActive: true
      },
      include: [
        {
          attributes: [],
          model: MasterGameAggregatorModel,
          where: {
            isActive: true
          },
          required: true
        }
      ],
      nest: true,
      raw: true
    })).map(x => {
      return x.masterCasinoProviderId
    })

    // const activeSubCategories = (
    //   await MasterGameSubCategoryModel.findAll({
    //     attributes: ['masterGameSubCategoryId'],
    //     where: {
    //       isActive: true
    //     },
    //     include: [
    //       {
    //         attributes: [],
    //         model: MasterGameCategoryModel,
    //         where: {
    //           isActive: true
    //         },
    //         required: true
    //       }
    //     ],
    //     nest: true,
    //     raw: true
    //   })
    // ).map(x => {
    //   return x.masterGameSubCategoryId
    // })

    const games = await FavoriteGameModel.findAndCountAll({
      where: { userId },
      include: [
        {
          model: MasterCasinoGameModel,
          include: [
            // {
            //   as: 'casinoGames',
            //   attributes: [],
            //   model: GameSubcategoryModel,
            //   where: {
            //     masterGameSubCategoryId: { [Op.in]: activeSubCategories }
            //   }
            // },
            {
              attributes: ['thumbnail', 'thumbnailType'],
              model: MasterCasinoGamesThumbnailModel
            }
          ],
          where: {
            masterCasinoProviderId: { [Op.in]: activeProviders },
            isActive: true
          },
          required: true
        }
      ],
      limit: size,
      distinct: true,
      offset: (pageNo - 1) * size,
      order: [['createdAt', 'DESC']]
    })

    const filteredGames = []

    await Promise.all(
      games.rows.map(async game => {
        game.MasterCasinoGame.dataValues.FavoriteGames = true
        filteredGames.push(game.dataValues.MasterCasinoGame)
        return true
      })
    )

    return {
      success: true,
      data: { count: games.count, rows: filteredGames },
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
