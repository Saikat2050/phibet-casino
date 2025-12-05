import { Op } from 'sequelize'
import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { AGGREGATORS, DEFAULT_CATEGORIES } from '@src/utils/constants/casinoManagement.constants'
import { sequelize } from '@src/database/models'
import { Logger } from '@src/libs/logger'

export class LoadAleaGamesService extends ServiceBase {
  async run () {
    /** @type {Language[]} */
    const languages = this.args.languages
    const data = this.args.data
    const transaction = await sequelize.transaction()

    Logger.info(`ALEA Poviders Length - ${data?.length}`)

    try {
      const aggregator = await this.createAggregator(AGGREGATORS.ALEA.id, AGGREGATORS.ALEA.name, languages, transaction)
      const providerIdsMap = await this.createProviders(aggregator.id, data, languages, transaction)

      const categories = DEFAULT_CATEGORIES.map(category => {
        return {
          uniqueId: category.id,
          name: this.getNames(languages, category.name)
        }
      })
      const updatedCategories = await this.context.sequelize.models.casinoCategory.bulkCreate(categories, {
        updateOnDuplicate: ['name'],
        transaction,
        logging: false
      })

      const categoryMap = updatedCategories.reduce((map, category) => {
        const names = category.name
        map[names.EN] = category.id // Map the English name to the category id
        return map
      }, {})

      await this.createGames(categoryMap, providerIdsMap, data, languages, transaction)
      await this.createCasinoGameCategory(transaction)

      await transaction.commit()
      return { success: true }
    } catch (error) {
      await transaction.rollback()
      throw new APIError(error)
    }
  }

  /**
   * @param {Language[]} languages
   * @param {string} defaultName
   */
  getNames (languages, defaultName) {
    return languages.reduce((prev, language) => {
      prev[language.code] = defaultName
      return prev
    }, {})
  }

  /**
   * @param {string} uniqueId
   * @param {string} name
   * @param {Language[]} languages
   * @param {import ('sequelize').Transaction} transaction
   * @returns {{ id: string }}
   */
  async createAggregator (uniqueId, name, languages, transaction) {
    const aggregatorNames = this.getNames(languages, name)
    const [aggregator] = await this.context.sequelize.models.casinoAggregator.findOrCreate({
      defaults: { name: aggregatorNames, uniqueId },
      where: { uniqueId },
      returning: ['id'],
      transaction,
      logging: false
    })

    return aggregator
  }

  /**
   * @param {string} aggregatorId
   * @param {{ id: number, name: string, logo: string, category: number }[]} providers
   * @param {Language[]} languages
   * @param {import ('sequelize').Transaction} transaction
   * @returns {Object.<string, string>}
   */
  async createProviders (aggregatorId, providers, languages, transaction) {
    // Create a map to filter out duplicates based on provider.software.id
    const uniqueProvidersMap = new Map()

    providers.forEach(provider => {
      if (!uniqueProvidersMap.has(provider.software.id)) {
        uniqueProvidersMap.set(provider.software.id, {
          casinoAggregatorId: aggregatorId,
          uniqueId: provider.software.id,
          name: this.getNames(languages, provider.software.name),
          iconUrl: provider.image
        })
      }
    })

    // Convert the map values back to an array for bulkCreate
    const uniqueProviders = Array.from(uniqueProvidersMap.values())

    const updatedProviders = await this.context.sequelize.models.casinoProvider.bulkCreate(uniqueProviders, {
      updateOnDuplicate: ['name'],
      transaction,
      logging: false
    })

    // Reduce the result to map uniqueId to the corresponding id
    return updatedProviders.reduce((prev, updatedProvider) => {
      prev[updatedProvider.uniqueId] = updatedProvider.id
      return prev
    }, {})
  }

  /**
   * @param {typeof DEFAULT_CATEGORIES[string]} categories
   * @param {Language[]} languages
   * @param {import ('sequelize').Transaction} transaction
   * @returns {Object.<string, string>}
   */
  async createCategories (categories, languages, transaction) {
    const updatedCategories = await this.context.sequelize.models.casinoCategory.bulkCreate(categories.map(category => {
      return {
        uniqueId: category.id,
        name: this.getNames(languages, category.name),
        slug: category.name.replace(/\s+/g, '').toLowerCase()
      }
    }), {
      returning: ['id', 'uniqueId'],
      updateOnDuplicate: ['updatedAt'],
      transaction,
      logging: false
    })

    return updatedCategories.reduce((prev, category) => {
      prev[category.uniqueId] = category.id
      return prev
    }, {})
  }

  /**
   * @param {Object.<string, string>} categoryIdsMap
   * @param {Object.<string, string>} providerIdsMap
   * @param {{ id: string, name: string, basicRTP: number, device: string, typeId: string, providerId: string, img_provider: string, img: string, demo: boolean }[]} games
   * @param {Language[]} languages
   * @param {import ('sequelize').Transaction} transaction
   * @returns {Boolean}
   */
  async createGames (categoryIdsMap, providerIdsMap, games, languages, transaction, genres = []) {
    const pokerList = []
    const newGames = games.reduce((prev, game) => {
      const { software, genre, id, name, assetsLink, demoAvailable, thumbnailLinks, rtp, volatility, ...moreDetails } = game

      const providerId = providerIdsMap[software.id]
      if (!providerId) return prev
      const categoryId = categoryIdsMap[genre] ? categoryIdsMap[genre] : 1

      if (!genres.includes(genre)) genres.push(genre)
      if (genre === 'Poker' || genre === 'poker') {
        if (!pokerList.includes(id)) pokerList.push(id)
      }

      prev.push({
        casinoProviderId: providerId,
        casinoCategoryId: categoryId,
        uniqueId: id,
        name: this.getNames(languages, name),
        wageringContribution: 0,
        desktopImageUrl: '',
        mobileImageUrl: '',
        devices: ['Desktop', 'Mobile'],
        demoAvailable: demoAvailable,
        thumbnailUrl: thumbnailLinks,
        returnToPlayer: rtp,
        volatilityRating: volatility,
        moreDetails
      })
      return prev
    }, [])

    await this.context.sequelize.models.casinoGame.bulkCreate(newGames, {
      updateOnDuplicate: ['wageringContribution', 'demoAvailable', 'thumbnailUrl', 'returnToPlayer', 'volatilityRating', 'moreDetails'],
      conflictAttributes: ['uniqueId', 'name'],
      transaction,
      logging: false
    })

    return true
  }

  /**
   * @param {import ('sequelize').Transaction} transaction
   * @return {Object}
   */
  async createCasinoGameCategory (transaction) {
    try {
      const casinoGames = await this.context.models.casinoGame.findAll({
        transaction,
        where: {
          isActive: true,
          casinoCategoryId: { [Op.ne]: null }
        },
        logging: false
      })

      const casinoGameCategoriesMap = casinoGames.map(game => ({
        casinoGameId: game.id,
        casinoCategoryId: game.casinoCategoryId
      }))

      const existingRecords = await this.context.models.casinoGameCategory.findAll({
        transaction,
        where: {
          [Op.or]: casinoGameCategoriesMap.map(record => ({
            casinoGameId: record.casinoGameId,
            casinoCategoryId: record.casinoCategoryId
          }))
        },
        attributes: ['casinoGameId', 'casinoCategoryId'],
        logging: false
      })

      const existingSet = new Set(
        existingRecords.map(record => `${record.casinoGameId}-${record.casinoCategoryId}`)
      )

      const newRecords = casinoGameCategoriesMap.filter(
        record => !existingSet.has(`${record.casinoGameId}-${record.casinoCategoryId}`)
      )

      if (newRecords.length > 0) {
        const casinoGameCategories = await this.context.models.casinoGameCategory.bulkCreate(
          newRecords,
          { transaction, logging: false }
        )
        return { status: true, casinoGameCategories }
      }

      return { status: true, casinoGameCategories: [] }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
