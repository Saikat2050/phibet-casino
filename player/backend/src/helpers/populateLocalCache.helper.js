import { sequelize } from '@src/database/models'
import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { SETTING_DATA_TYPES } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'

function settingParser (settingDataType, value) {
  if (settingDataType === SETTING_DATA_TYPES.JSON) return value
  if (settingDataType === SETTING_DATA_TYPES.PERCENTAGE) return Number(value)
  if (settingDataType === SETTING_DATA_TYPES.BOOLEAN) return _.isBoolean(value)
  return global[_.startCase(settingDataType)](value)
}

async function populateTranslationCache () {
  const languageModel = sequelize.models.language
  const languages = await languageModel.findAll({ raw: true })

  const { locales, messages } = languages.reduce((prev, language) => {
    prev.locales.push(language.code)
    prev.messages[language.code] = language.translations || {}
    return prev
  }, { locales: !languages.length ? ['en'] : [], messages: { en: {} } })

  await Cache.set('errorMessages', messages)
  await Cache.set('locales', locales)
  Logger.info('Cache', { message: 'Translation cache populated...' })
}

async function populateSettingsCache () {
  const settingModel = sequelize.models.setting
  const settings = await settingModel.findAll({ raw: true })
  const modifiedSettings = settings.reduce((prev, setting) => {
    prev[setting.key] = settingParser(setting.dataType, setting.value)
    return prev
  }, {})

  await Cache.set(CACHE_KEYS.SETTINGS, modifiedSettings)
  Logger.info('Cache', { message: 'Settings cache populated...' })
}

async function populateCurrenciesCache () {
  const currencies = await sequelize.models.currency.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.CURRENCIES, currencies)
  Logger.info('Cache', { message: 'Currencies cache populated...' })
}

async function populatePagesCache () {
  const pages = await sequelize.models.page.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.PAGES, pages)
  Logger.info('Cache', { message: 'Pages cache populated...' })
}

async function populateLanguagesCache () {
  const languages = await sequelize.models.language.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.LANGUAGES, languages)
  Logger.info('Cache', { message: 'Languages cache populated...' })
}

async function populateBannerCache () {
  const banners = await sequelize.models.banner.findAll({
    attributes: ['id', 'type'],
    include: [{
      model: sequelize.models.bannerItem,
      as: 'items',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['order', 'ASC'], ['id', 'ASC']]
    }],
    order: [['id', 'ASC']]
  })
  await Cache.set(CACHE_KEYS.BANNERS, banners)
  Logger.info('Cache', { message: 'Banners cache populated...' })
}

async function populateBannerItemsCache () {
  const bannerItems = await sequelize.models.bannerItem.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true })
  await Cache.set(CACHE_KEYS.BANNER_ITEMS, bannerItems)
  Logger.info('Cache', { message: 'Banner items cache populated...' })
}
async function populateCountryCache () {
  const countries = await sequelize.models.country.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.COUNTRIES, countries)
  Logger.info('Cache', { message: 'Countries cache populated...' })
}

async function populateVipLevelDetails () {
  const vipLevelDetails = await sequelize.models.vipTier.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, order: [['id', 'ASC']], raw: true })
  await Cache.set(CACHE_KEYS.VIP_TIER, vipLevelDetails)
  Logger.info('Cache', { message: 'Vip level details cache populated...' })
}

export async function populateStatesCache () {
  const states = await sequelize.models.state.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { isActive: true }, raw: true })
  await Cache.set(CACHE_KEYS.STATES, states)
  Logger.info('Cache', { message: 'States cache populated...' })
}

export async function populateUserDetails () {
  const userDetails = await sequelize.models.user.findAll({
    attributes: ['id', 'uniqueId', 'username'],
    where: { isActive: true },
    order: [['id', 'ASC']],
    include: {
      model: sequelize.models.userVipTier,
      attributes: ['id'],
      where: { isActive: true },
      include: {
        model: sequelize.models.vipTier,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: true
      },
      required: true
    }
  })
  for (const user of userDetails) {
    await Cache.set(`${user.uniqueId}_details`, {
      activeTier: user.userVipTiers[0].vipTier
    })
  }
  Logger.info('Cache', { message: 'User details cache populated...' })
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
  await populateTranslationCache()
  await populatePagesCache()
  await populateBannerCache()
  await populateBannerItemsCache()
  await populateCountryCache()
  await populateVipLevelDetails()
  await populateUserDetails()
  await populateStatesCache()
  await populateSeoPagesCache()
}
