import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import ServiceBase from '../serviceBase'
import { sequelize } from '../../db/models'
import config from '../../configs/app.config'
import socketServer from '../../libs/socketServer'
import { prepareImageUrl } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../utils/constants/constant'
export class GetSubCategoryService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FavoriteGame: FavoriteGameModel,
        GameSubcategory: GameSubcategoryModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterGameCategory: MasterGameCategoryModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel,
        MasterGameSubCategory: MasterGameSubCategoryModel,
        MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel
      }
    } = this.context
    const {
      categoryId,
      search,
      subCategoryId,
      masterCasinoProviderId,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT
    } = this.args

    // If logged in user
    let userId
    const token = this.context?.req?.headers?.accesstoken
    if (token) {
      try {
        const tokenPayload = jwt.verify(token, config.get('jwt.loginTokenSecret'))
        userId = tokenPayload?.id
      } catch (error) {
        console.log('error while decoding jwt token', error)
      }
    }

    const redisString = await socketServer.redisClient.get(`subCategoryData-${this.context.req.originalUrl}`)

    if (redisString) {
      const redisData = JSON.parse(redisString)
      if (userId) {
        const allGameIds = redisData
        .flatMap(subCategory => subCategory.subCategoryGames)
        .map(game => game.masterCasinoGameId)
        const favoriteGames = await FavoriteGameModel.findAll({
          attributes: ['masterCasinoGameId'],
          where: {
            userId,
            masterCasinoGameId: { [Op.in]: allGameIds }
          },
          raw: true
        })
        const favoriteGameIds = new Set(favoriteGames.map(fav => fav.masterCasinoGameId))
        console.log("favoriteGameIds==============", favoriteGameIds)
        redisData.forEach(subCategory => {
          subCategory.subCategoryGames.forEach(game => {
            game.FavoriteGames = favoriteGameIds.has(game.masterCasinoGameId)
          })
        })
      }
      return {
        success: true,
        data: redisData,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    }

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

    let casinoProviderSearch = {}
    if (search) {
      casinoProviderSearch = {
        name: {
          [Op.iLike]: `%${search}%`
        }
      }
    }

    let providerWhere = {}
    if (+masterCasinoProviderId && +masterCasinoProviderId > 0) {
      providerWhere = { masterCasinoProviderId: +masterCasinoProviderId }
    }
    const providers = await MasterCasinoProviderModel.findAll({
      where: {
        isActive: true,
        masterGameAggregatorId: { [Op.in]: activeAggregators },
        ...providerWhere,
        ...casinoProviderSearch
      },
      raw: true
    })

    const activeProviders = []
    providers.map(x => {
      return activeProviders.push(x.masterCasinoProviderId)
    })

    let categoryWhere = { isActive: true }
    if (+categoryId > 0) categoryWhere = { ...categoryWhere, masterGameCategoryId: +categoryId }

    const categories = await MasterGameCategoryModel.findAll({
      where: categoryWhere,
      order: [['orderId', 'ASC']]
    })

    const activeCategories = []
    categories.map(x => {
      return activeCategories.push(x.masterGameCategoryId)
    })

    let subCategoryIdSearch = {}
    if (+subCategoryId > 0) {
      subCategoryIdSearch = {
        masterGameSubCategoryId: subCategoryId
      }
    }

    const subCategories = (
      await MasterGameSubCategoryModel.findAll({
        attributes: [
          'masterGameSubCategoryId',
          'name',
          'masterGameCategoryId',
          'orderId',
          'isActive',
          'isFeatured',
          'imageUrl'
        ],
        include: [
          {
            model: GameSubcategoryModel,
            attributes: ['orderId', 'masterCasinoGameId'],
            include: [
              {
                as: 'casinoGames',
                model: MasterCasinoGameModel,
                attributes: {
                  exclude: ['orderId']
                },
                where: {
                  isActive: true,
                  masterCasinoProviderId: { [Op.in]: activeProviders }
                },
                required: true
              }
            ]
          }
        ],
        where: {
          isActive: true,
          masterGameCategoryId: {
            [Op.in]: activeCategories
          },
          ...subCategoryIdSearch
        },
        order: [
          ['orderId', 'ASC'],
          [{ model: GameSubcategoryModel }, 'orderId', 'ASC']
        ]
      })
    ).filter(subCategory => subCategory.GameSubcategories.length !== 0)
    try {
      await Promise.all(
        subCategories.map(async subCategory => {
          const totalGames = subCategory.GameSubcategories.length
          totalGames > page * limit
            ? (subCategory.dataValues = {
                ...subCategory.dataValues,
                isMoreGame: true
              })
            : (subCategory.dataValues = {
                ...subCategory.dataValues,
                isMoreGame: false
              })
          const subCategoryGames = subCategory.GameSubcategories.slice(
            (page - 1) * limit,
            page * limit
          )

          subCategory.dataValues.imageUrl = {
            thumbnail: subCategory.dataValues.imageUrl?.thumbnail
              ? prepareImageUrl(subCategory.dataValues.imageUrl?.thumbnail)
              : '',
            selectedThumbnail: subCategory.dataValues.imageUrl
              ?.selectedThumbnail
              ? prepareImageUrl(
                  subCategory.dataValues.imageUrl?.selectedThumbnail
                )
              : ''
          }

          delete subCategory.dataValues.GameSubcategories

          subCategory.dataValues = {
            ...subCategory.dataValues,
            subCategoryGames
          }
          await Promise.all(
            subCategory.dataValues.subCategoryGames.map(async game => {
              game.dataValues = {
                ...game.orderId,
                ...game.casinoGames.dataValues
              }

              const thumbnails = await MasterCasinoGamesThumbnailModel.findAll({
                attributes: ['thumbnailType', 'thumbnail'],
                where: {
                  masterCasinoGameId: game.masterCasinoGameId
                }
              })

              await Promise.all(
                thumbnails.map(x => {
                  x.thumbnail = prepareImageUrl(x.thumbnail)
                  return true
                })
              )

              game.dataValues = {
                ...game.dataValues,
                MasterCasinoGamesThumbnails: thumbnails
              }
            })
          )
        })
      )

      if (!search) await socketServer.redisClient.set(`subCategoryData-${this.context.req.originalUrl}`, JSON.stringify(subCategories))

        if (userId) {
          const allGameIds = subCategories
            .flatMap(subCategory => subCategory.dataValues.subCategoryGames)
            .map(game => game.masterCasinoGameId)
        
          const favoriteGames = await FavoriteGameModel.findAll({
            attributes: ['masterCasinoGameId'],
            where: {
              userId,
              masterCasinoGameId: { [Op.in]: allGameIds }
            },
            raw: true
          })
        
          const favoriteGameIds = new Set(favoriteGames.map(fav => fav.masterCasinoGameId))
        
          subCategories.forEach(subCategory => {
            subCategory.dataValues.subCategoryGames.forEach(game => {
              game.dataValues.FavoriteGames = favoriteGameIds.has(game.masterCasinoGameId)
            })
          })
        }
    } catch (error) {
      console.log(error)
    }

    return {
      success: true,
      data: subCategories,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
