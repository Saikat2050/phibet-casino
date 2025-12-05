import { ServiceBase } from '@src/libs/serviceBase'
import axios from 'axios'
import { Logger } from '@src/libs/logger'
import { sequelize } from '@src/database'
import { iconic21CasinoConfig } from '@src/configs/iconic21.config'
import { AGGREGATORS } from '@src/utils/constants/casinoManagement.constants'
import crypto from 'crypto'
import { v4 as uuid } from 'uuid'
const { Op } = require('sequelize')

export class LoadIconic21GamesService extends ServiceBase {
  async run () {
    const transaction = await sequelize.transaction()
    try {
      const languages = ['EN', 'RU', 'UK', 'TH', 'ZH', 'ES', 'HI', 'PT', 'KO', 'JA', 'TR', 'VI', 'ID', 'MS', 'FR']
      const { baseUrl: endPoint, casino, secretKey } = iconic21CasinoConfig
      const { ICONIC21 } = AGGREGATORS
      const buildLanguageMap = (value) => languages.reduce((acc, lang) => ({ ...acc, [lang]: value }), {})

      if (!endPoint || !casino || !secretKey) {
        Logger.error('Credentials not found for Iconic 21.')
        await transaction.rollback()
        return { success: false, message: 'Credentials not found for Iconic 21.' }
      }

      // create aggregator
      const [aggregator] = await sequelize.models.casinoAggregator.findOrCreate({
        where: { uniqueId: ICONIC21?.id },
        defaults: {
          name: buildLanguageMap(ICONIC21?.name),
          uniqueId: ICONIC21?.id,
          isActive: false
        },
        transaction,
        logging: false
      })

      // create provider
      const [provider] = await sequelize.models.casinoProvider.findOrCreate({
        where: { uniqueId: ICONIC21?.providerId, casinoAggregatorId: aggregator?.id },
        defaults: {
          name: buildLanguageMap(ICONIC21?.provider),
          uniqueId: ICONIC21?.providerId,
          casinoAggregatorId: aggregator?.id
        },
        transaction,
        logging: false
      })

      // getting games data
      const reqData = {
        casino,
        languages: languages.map(l => l.toLowerCase()),
        currencies: ['usd'],
        resolutions: ['250_250', '264_190', '380_270', '440_310', '500_280', '500_360', '500_500', '556_420', '846_846', '900_1344']
      }

      const signature = crypto.createHash('sha256').update(`${secretKey}${JSON.stringify(reqData)}`).digest('hex')

      const option = {
        url: `${endPoint}/api/v2/tables/available`,
        method: 'POST',
        headers: {
          'X-REQUEST-SIGN': signature,
          'Content-Type': 'application/json'
        },
        data: reqData
      }
      const { data } = await axios(option)

      // Process games sequentially to avoid race conditions with categories
      for (const gameDetail of data?.tables) {
        const { launchAlias, rtp, productType, gameName, language, betLimits, houseEdge, ...moreDetails } = gameDetail
        const isGameExist = await sequelize.models.casinoGame.findOne({
          where: { uniqueId: launchAlias, casinoProviderId: provider?.id },
          attributes: ['id', 'name', 'returnToPlayer'],
          transaction
        })

        const gameNames = Object.fromEntries(
          (gameDetail.names || []).map(({ language, tableName }) => [language.toUpperCase(), tableName])
        )
        if (!isGameExist) {
          // finding category Id
          const normalizedType = productType?.toLowerCase() === 'slot' ? 'Slots' : productType
          let categoryId

          const [category] = await sequelize.models.casinoCategory.findOrCreate({
            where: sequelize.where(
              sequelize.literal('name->>\'EN\''),
              { [Op.iLike]: normalizedType }
            ),
            defaults: {
              name: buildLanguageMap(normalizedType),
              isActive: true,
              uniqueId: uuid(),
              isSidebar: false,
              isLobbyPage: true
            },
            transaction
          })
          categoryId = category.id

          const thumbnailUrl = {}
          gameDetail.images.forEach(image => {
            thumbnailUrl[`RATIO_${image.resolution}`] = image.staticImageUrl
          })
          // adding casino game
          await sequelize.models.casinoGame.create(
            {
              casinoProviderId: provider?.id,
              casinoCategoryId: categoryId,
              uniqueId: launchAlias,
              name: gameNames,
              wageringContribution: 0,
              desktopImageUrl: '',
              mobileImageUrl: '',
              devices: ['Desktop', 'Mobile'],
              thumbnailUrl,
              returnToPlayer: rtp,
              moreDetails: { gameName, language, betLimits, houseEdge, ...moreDetails }
            },
            { transaction }
          )
        } else if (isGameExist?.returnToPlayer !== gameDetail?.rtp || JSON.stringify(isGameExist?.name) !== JSON.stringify(gameNames)) {
          if (isGameExist?.returnToPlayer !== gameDetail?.rtp) isGameExist.returnToPlayer = gameDetail.rtp
          if (isGameExist?.name !== gameNames) isGameExist.name = gameNames
          await isGameExist.save({ transaction })
        }
      }

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
            where: { uniqueId: ICONIC21.id },
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

      await transaction.commit()
      return { success: true, status: 200, message: 'Games added successfully' }
    } catch (error) {
      await transaction.rollback()
      Logger.error(`Error in loading casino games iconic 21 - ${error}`)
      return { success: false, message: 'Error in loading iconic21 casino games.' }
    }
  }
}
