import { sequelize } from '../db/models'
import { CACHE_KEYS } from '../utils/constants/constant'
import socketServer from '../libs/socketServer'
import Logger from '../libs/logger'

async function populateGamesCache () {
  const games = await sequelize.models.MasterCasinoGame.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await socketServer.redisClient.set(CACHE_KEYS.GAMES, JSON.stringify(games))
  Logger.info('Cache', { message: 'Games cache populated...' })
}

async function populateProviderCache () {
  const provider = await sequelize.models.MasterCasinoProvider.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await socketServer.redisClient.set(CACHE_KEYS.PROVIDERS, JSON.stringify(provider))
  Logger.info('Cache', { message: 'Providers cache populated...' })
}

async function populateAggregatorCache () {
  const aggregator = await sequelize.models.MasterGameAggregator.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await socketServer.redisClient.set(CACHE_KEYS.AGGREGATOR, JSON.stringify(aggregator))
  Logger.info('Cache', { message: 'Providers cache populated...' })
}

// async function populateFavoriteGameCache () {
//   const favoriteGames = await sequelize.models.FavoriteGame.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
//   await setData(CACHE_KEYS.FAVORITE_GAMES, favoriteGames)
//   Logger.info('Cache', { message: 'FavoriteGames cache populated...' })
// }

async function populateBannerCache () {
  const banner = await sequelize.models.PageBanner.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: ['order'], raw: true })
  await socketServer.redisClient.set(CACHE_KEYS.BANNER, JSON.stringify(banner))
  Logger.info('Cache', { message: 'Banner cache populated...' })
}

export async function populatePaymentProviderCache () {
  const paymentprovider = await sequelize.models.PaymentProvider.findAll({ where: { isArchived: false }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await socketServer.redisClient.set(CACHE_KEYS.PAYMENTPROVIDER, JSON.stringify(paymentprovider))
  Logger.info('Cache', { message: 'Paymentproviders cache populated...' })
}

// async function populateCmsCache () {
//   const cmsPages = await sequelize.models.CmsPage.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
//   await setData(CACHE_KEYS.CMS, cmsPages)
//   Logger.info('Cache', { message: 'CMS cache populated successfully...' })
// }

export async function populateCache () {
  await Promise.allSettled([
    populateGamesCache(),
    // populateBannerCache(),
    // populateCmsCache(),
    populateAggregatorCache(),
    // populateFavoriteGameCache(),
    populateProviderCache(),
    populateBannerCache(),
    populatePaymentProviderCache()
  ])
}
