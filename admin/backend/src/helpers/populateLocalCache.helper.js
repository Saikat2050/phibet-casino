import { sequelize } from '@src/database/models'
import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import _ from 'lodash'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'

function settingParser (settingDataType, value) {
  if (settingDataType === SETTING_DATA_TYPES.JSON) return JSON.parse(value)
  if (settingDataType === SETTING_DATA_TYPES.PERCENTAGE) return Number(value)
  if (settingDataType === SETTING_DATA_TYPES.BOOLEAN) return value === 'true'
  return global[_.startCase(settingDataType)](value)
}

export async function populateSettingsCache (context) {
  const settingModel = (context) ? context.sequelize.models.setting : sequelize.models.setting
  const transaction = (context) ? context.sequelizeTransaction : null

  const settings = await settingModel.findAll({ raw: true, transaction })
  const modifiedSettings = settings.reduce((prev, setting) => {
    prev[setting.key] = settingParser(setting.dataType, setting.value)
    return prev
  }, {})

  await Cache.set(CACHE_KEYS.SETTINGS, modifiedSettings)
  Logger.info('Cache', { message: 'Settings cache populated...' })
}

export async function populateCurrenciesCache () {
  const currencies = await sequelize.models.currency.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.CURRENCIES, currencies)
  Logger.info('Cache', { message: 'Currencies cache populated...' })
}

export async function populatePagesCache (context) {
  let pages
  if (context) pages = await context.sequelize.models.page.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true, transaction: context?.sequelizeTransaction })
  else pages = await sequelize.models.page.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })

  await Cache.set(CACHE_KEYS.PAGES, pages)
  Logger.info('Cache', { message: 'Pages cache populated...' })
}

export async function populateLanguagesCache () {
  const languages = await sequelize.models.language.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.LANGUAGES, languages)
  Logger.info('Cache', { message: 'Languages cache populated...' })
}

export async function populateCountriesCache () {
  const countries = await sequelize.models.country.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.COUNTRIES, countries)
  Logger.info('Cache', { message: 'Countries cache populated...' })
}

export async function populateBannerCache (context) {
  let banners
  if (context) {
    banners = await context.sequelize.models.banner.findAll({
      attributes: ['id', 'type'],
      include: [{
        model: context.sequelize.models.bannerItem,
        as: 'items',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['order', 'ASC'], ['id', 'ASC']]
      }],
      order: [['id', 'ASC']],
      transaction: context.sequelizeTransaction
    })
  } else {
    banners = await sequelize.models.banner.findAll({
      attributes: ['id', 'type'],
      include: [{
        model: sequelize.models.bannerItem,
        as: 'items',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['order', 'ASC'], ['id', 'ASC']]
      }],
      order: [['id', 'ASC']]
    })
  }
  await Cache.set(CACHE_KEYS.BANNERS, banners)
  Logger.info('Cache', { message: 'Banners cache populated...' })
}

async function populateBannerItemsCache () {
  const bannerItems = await sequelize.models.bannerItem.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await Cache.set(CACHE_KEYS.BANNER_ITEMS, bannerItems)
  Logger.info('Cache', { message: 'Banner items cache populated...' })
}

export async function populateVipLevelDetails (context) {
  let vipLevelDetails
  if (context) vipLevelDetails = await context.sequelize.models.vipTier.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, order: [['id', 'ASC']], raw: true, transaction: context.sequelizeTransaction })
  else vipLevelDetails = await sequelize.models.vipTier.findAll({ where: { isActive: true }, attributes: { exclude: ['createdAt', 'updatedAt'] }, order: [['id', 'ASC']], raw: true })

  await Cache.set(CACHE_KEYS.VIP_TIER, vipLevelDetails)
  Logger.info('Cache', { message: 'Vip level details cache populated...' })
}

export async function populateAllVipLevelDetails (context) {
  let vipLevelDetails
  if (context) vipLevelDetails = await context.sequelize.models.vipTier.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: [['id', 'ASC']], raw: true, transaction: context.sequelizeTransaction })
  else vipLevelDetails = await sequelize.models.vipTier.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, order: [['id', 'ASC']], raw: true })

  await Cache.set(CACHE_KEYS.ALL_VIP_TIERS, vipLevelDetails)
  Logger.info('Cache', { message: 'All Vip level details cache populated...' })
}

export async function populateStatesCache (transaction) {
  const states = await sequelize.models.state.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true, transaction })
  await Cache.set(CACHE_KEYS.STATES, states)
  Logger.info('Cache', { message: 'States cache populated...' })
}

export async function populateSeoPagesCache (transaction) {
  const seoPages = await sequelize.models.seoPages.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true, transaction })
  await Cache.set(CACHE_KEYS.SEO_PAGES, seoPages)
  Logger.info('Cache', { message: 'SEO Pages cache populated...' })
}

export async function populateCache () {
  await populateSettingsCache()
  await populateLanguagesCache()
  await populateCurrenciesCache()
  await populatePagesCache()
  await populateBannerCache()
  await populateVipLevelDetails()
  await populateStatesCache()
  await populateAllVipLevelDetails()
  await populateSeoPagesCache()
}
