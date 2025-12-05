export const AGGREGATORS = {
  NUX: {
    id: '1',
    name: 'nux'
  }
}

export const CACHE_KEYS = {
  PAGES: 'pages',
  SPORTS: 'sports',
  SETTINGS: 'settings',
  LANGUAGES: 'languages',
  COUNTRIES: 'countries',
  CURRENCIES: 'currencies',
  TRANSLATIONS: 'translations',
  ERROR_MESSAGES: 'error_messages',
  DASHBOARD_DATA_CACHE: 'statical-summury:',
  PLAYER_COUNT: 'total-player-counts',
  GAME_COUNT: 'total-games',
  PROVIDER_COUNT: 'total-providers',
  OVERALL_GGR: 'overall_casino_ggr',
  WELCOME_PACKAGE: 'welcome_package'
}

export const CACHE_STORE_PREFIXES = {
  BACKEND_CACHE: 'backend-cache:',
  SESSION: 'user-backend-session:',
  USER_BACKEND_CACHE: 'user-backend-cache:',
  DASHBOARD_DATA_CACHE: 'statical-summury:',
  PLAYER_COUNT: 'total-player-counts'
}

/**
 * @type {Object.<string, { id: string, name: string, subCategories: { id: string, name: string }[] }[]>}
 */
export const DEFAULT_CATEGORIES = [{
  id: 1,
  name: 'Live'
}, {
  id: 2,
  name: 'Slot'
}, {
  id: 3,
  name: 'Virtuals'
}, {
  id: 4,
  name: 'TvGames'
}, {
  id: 5,
  name: 'Poker'
}, {
  id: 6,
  name: 'SportBook'
}]
