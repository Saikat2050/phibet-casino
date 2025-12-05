import path from 'path'

export const REPORT_TIME_PERIOD_FILTER = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  LAST_90_DAYS: 'last90days',
  MONTH_TO_DATE: 'monthtodate',
  CUSTOM: 'custom'
}

export const CACHE_KEYS = {
  PAGES: 'pages',
  STATES: 'states',
  BANNERS: 'banners',
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
  PAYMENT_AGGREGATORS: 'paymentAggregators',
  VIP_TIER: 'vip_tier',
  DAILY_BONUS: 'daily_bonus',
  ALL_VIP_TIERS: 'all_vip_tiers',
  WELCOME_PACKAGE: 'welcome_package',
  SEO_PAGES: 'seo_pages'
}

export const CACHE_STORE_PREFIXES = {
  BACKEND_CACHE: 'backend-cache:',
  SESSION: 'user-backend-session:',
  USER_BACKEND_CACHE: 'user-backend-cache:'
}

export const JWT_TOKEN_TYPES = {
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot_password'
}

export const SETTING_KEYS = {
  LOGO: 'logo',
  MAX_ODDS: 'maxOdds',
  MIN_ODDS: 'minOdds',
  ALLOW_BETTING: 'allowBetting',
  MIN_STAKE_AMOUNT: 'minStakeAmount',
  EXCHANGE_BET_COMMISSION: 'exchangeBetCommission',
  ADMIN_END_URL: 'adminEndUrl',
  USER_END_URL: 'userEndUrl',
  APPLICATION_NAME: 'applicationName',
  MAINTENANCE: 'maintenance',
  CASINO: 'casino',
  DEFAULT_SUPPORT: 'defaultSupport',
  GALLERY: 'gallery',
  REFERRAL: 'referral',
  LEGAL_SUPPORT: 'legalSupport',
  PARTNER_SUPPORT: 'partnersSupport',
  DEFAULT_CHAT_SETTINGS: 'defaultChatSettings',
  CHAT_CONFIGURATION: 'chatConfiguration',
  AMOE_ADDRESS: 'amoEntryAddress',
  DEPOSIT_KYC_REQUIRED: 'depositKycRequired',
  WITHDRAW_KYC_REQUIRED: 'withdrawKycRequired',
  DEPOSIT_PHONE_REQUIRED: 'depositPhoneRequired',
  WITHDRAW_PHONE_REQUIRED: 'withdrawPhoneRequired',
  DEPOSIT_PROFILE_REQUIRED: 'depositProfileRequired',
  WITHDRAW_PROFILE_REQUIRED: 'withdrawProfileRequired',
  XP_REQUIREMENTS: 'xpRequirements',
  PAYMENT_PROVIDER_DEPOSIT: 'paymentProviderDeposit',
  PAYMENT_PROVIDER_WITHDRAW: 'paymentProviderWithdraw',
  GAME_PLAY_KYC_REQUIRED: 'gamePlayeKycRequired',
  FOOTER_LANDING_PAGE: 'footerLandingPage',
  FOOTER_LOBBY_PAGE: 'footerLobbyPage',
  PURCHASE_COOLDOWN: 'purchaseCooldown'
}

export class S3FolderHierarchy {
  static #basePath = 'assets'

  static get common () {
    return path.join(this.#basePath, 'common')
  }

  static get gallery () {
    return path.join(this.#basePath, 'gallery')
  }

  static get banner () {
    return path.join(this.#basePath, 'banner')
  }

  static get bonus () {
    return path.join(this.#basePath, 'bonus')
  }

  static get notifications () {
    return path.join(this.#basePath, 'notifications')
  }

  static get tournament () {
    return path.join(this.#basePath, 'tournament')
  }

  static get paymentProvider () {
    return path.join(this.#basePath, 'paymentProvider')
  }

  static get query () {
    return path.join(this.#basePath, 'query')
  }

  static get providers () {
    return path.join(this.#basePath, 'providers')
  }

  static get store () {
    const basePath = path.join(this.#basePath, 'store')
    return {
      package: path.join(basePath, 'package')
    }
  }

  static get casino () {
    const basePath = path.join(this.#basePath, 'casino')
    return {
      games: path.join(basePath, 'games'),
      providers: path.join(basePath, 'providers'),
      categories: path.join(basePath, 'categories'),
      subCategories: path.join(basePath, 'sub-categoriess')
    }
  }

  static get user () {
    const basePath = path.join(this.#basePath, 'user')
    return {
      documents: path.join(basePath, 'documents'),
      profileImages: path.join(basePath, 'profileImages')
    }
  }
}

export const DEFAULT_SITE_LAYOUT = {
  error: null,
  isMobile: false,
  leftMenu: false,
  isLoading: true,
  layoutType: 'vertical',
  isPreloader: false,
  layoutWidth: 'fluid',
  showSidebar: true,
  topbarTheme: 'light',
  layoutModeType: 'light',
  showBreadcrumb: false,
  leftSideBarType: 'default',
  leftSideBarTheme: 'dark',
  showRightSidebar: false,
  tableHeaderClass: 'table-light',
  leftSideBarThemeImage: 'none'
}

export const DEFAULT_REFERRAL = {
  amount: 0,
  isActive: false
}

export const SUCCESS_MSG = {
  CREATE_SUCCESS: 'Record created successfully',
  DELETE_SUCCESS: 'Record deleted successfully',
  UPDATE_SUCCESS: 'Record updated successfully'
}

export const GROUP_CRITERIA_ARRAY = ['KYC_CRITERIA', 'WAGERING_CRITERIA', 'RANKING_LEVEL_CRITERIA']

export const JACKPOT_STATUS = {
  UPCOMING: 0,
  RUNNING: 1,
  COMPLETED: 2
}
