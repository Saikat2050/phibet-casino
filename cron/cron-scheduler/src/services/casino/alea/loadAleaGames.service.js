import { Op } from 'sequelize'
import { ServiceBase } from '@src/libs/serviceBase'
import { v4 as uuidv4 } from 'uuid'
import { AGGREGATORS } from '@src/utils/constants/casinoManagement.constants'
import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'

export class LoadAleaGamesService extends ServiceBase {
  async run () {
    /** @type {Language[]} */
    const languages = this.args.languages
    const data = this.args.data
    const transaction = await sequelize.transaction()

    const genres = []
    const categories = []

    try {
      const aggregator = await this.createAggregator(AGGREGATORS.ALEA.id, AGGREGATORS.ALEA.name, languages, transaction)
      const providerIdsMap = await this.createProviders(aggregator.id, data, languages, transaction)

      const newCategories = data.reduce((prev, game) => {
        const { genre } = game
        if (!categories.includes(genre)) {
          categories.push(genre)
          prev.push({
            uniqueId: uuidv4(),
            name: this.getNames(languages, genre)
          })
        }
        return prev
      }, [])

      for (const category of newCategories) {
        await sequelize.models.casinoCategory.findOrCreate({
          where: { 'name.EN': category.name.EN },
          defaults: { name: category.name, uniqueId: category.uniqueId, isSidebar: false, isLobbyPage: true },
          attributes: ['id', 'name'],
          transaction,
          logging: false,
          raw: true
        })
      }

      const updatedCategories = await sequelize.models.casinoCategory.findAll({
        attributes: ['name', 'id'],
        transaction,
        logging: false
      })

      const categoryMap = updatedCategories.reduce((map, category) => {
        const names = category.name
        map[names.EN] = category.id // Map the English name to the category id
        return map
      }, {})

      await this.createGames(categoryMap, providerIdsMap, data, languages, transaction, genres)
      await this.createCasinoGameCategory(transaction)

      await transaction.commit()
      return { success: true }
    } catch (error) {
      await transaction.rollback()
      Logger.error(`Error in loading casino games - ${error}`)
      return { success: false, message: 'Error in loading casino games.' }
    }
  }

  /**
   * @param {Language[]} languages
   * @param {string} defaultName
   */
  getNames (languages, defaultName) {
    return languages.reduce((prev, language) => {
      prev[language] = defaultName
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
    const [aggregator] = await sequelize.models.casinoAggregator.findOrCreate({
      defaults: { name: aggregatorNames, uniqueId, isActive: false },
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

    const updatedProviders = await sequelize.models.casinoProvider.bulkCreate(uniqueProviders, {
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
    const updatedCategories = await sequelize.models.casinoCategory.bulkCreate(categories.map(category => {
      return {
        uniqueId: category.id,
        name: this.getNames(languages, category.name),
        slug: category.name.replace(/\s+/g, '').toLowerCase()
      }
    }), {
      returning: ['id', 'uniqueId'],
      updateOnDuplicate: ['updatedAt', 'slug', 'name'],
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
    const newGames = games.reduce((prev, game) => {
      const { software, genre, id, name, assetsLink, demoAvailable, thumbnailLinks, rtp, volatility, ...moreDetails } = game

      const providerId = providerIdsMap[software.id]
      if (!providerId) return prev
      const categoryId = categoryIdsMap[genre] ? categoryIdsMap[genre] : 1

      if (!genres.includes(genre)) genres.push(genre)

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

    Logger.info(`Games length - ${newGames?.length}`)

    await sequelize.models.casinoGame.bulkCreate(newGames, {
      updateOnDuplicate: ['wageringContribution', 'demoAvailable', 'thumbnailUrl', 'returnToPlayer', 'volatilityRating', 'moreDetails', 'casinoCategoryId'],
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
      const casinoGames = await sequelize.models.casinoGame.findAll({
        transaction,
        where: { isActive: true, casinoCategoryId: { [Op.ne]: null } },
        include: {
          model: sequelize.models.casinoProvider,
          where: { isActive: true },
          required: true,
          attributes: [],
          include: {
            attributes: ['id'],
            model: sequelize.models.casinoAggregator,
            where: { uniqueId: AGGREGATORS.ALEA.id },
            required: true
          }
        },
        attributes: ['id', 'casinoCategoryId'],
        logging: false
      })

      const casinoGameCategoriesMap = casinoGames.map(game => ({
        casinoGameId: game.id,
        casinoCategoryId: game.casinoCategoryId
      }))

      const existingRecords = await sequelize.models.casinoGameCategory.findAll({
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

      if (newRecords.length > 0) await sequelize.models.casinoGameCategory.bulkCreate(newRecords, { transaction, logging: false })

      return { status: true, casinoGameCategories: [] }
    } catch (error) {
      return { success: false, message: 'Error in casino game categories service.' }
    }
  }
}
