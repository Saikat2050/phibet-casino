import path from 'path'

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'AccessToken'
}

export const CACHE_STORE_PREFIXES = {
  BACKEND_CACHE: 'backend-cache:',
  SESSION: 'user-backend-session:',
  USER_BACKEND_CACHE: 'user-backend-cache:'
}

export const CACHE_STORE_SUFFIXES = {
  VERIFY_OTP: ':verify-otp',
  BET_ROLLBACK: ':bet-rollback'
}

export const JWT_TOKEN_TYPES = {
  PHONE: 'phone',
  VERIFY_EMAIL: 'verify_email',
  FORGOT_PASSWORD: 'forgot_password'
}

export const CACHE_KEYS = {
  PAGES: 'pages',
  STATES: 'states',
  BANNERS: 'banners',
  BANNER_ITEMS: 'banner_items',
  SETTINGS: 'settings',
  LANGUAGES: 'languages',
  COUNTRIES: 'countries',
  CURRENCIES: 'currencies',
  TRANSLATIONS: 'translations',
  ERROR_MESSAGES: 'error_messages',
  DOCUMENT_LABELS: 'document_labels',
  VIP_TIER: 'vip_tier',
  DAILY_BONUS: 'daily_bonus',
  JOINING_BONUS: 'joining_bonus',
  USER_BACKEND_SESSION_MAP: 'user_backend_session_map',
  PAYSAFE_BANK_DETAILS: 'payByBankDetails_',
  WELCOME_PACKAGE: 'welcome_package',
  SEO_PAGES: 'seo_pages'
}

export const USER_FILE_UPLOAD_SERVER_LOCATION = path.join(__dirname, '../../../userUploads')

export const S3_USER_FILE_PATHS = {
  DOCUMENT: 'arc/user/documents',
  PROFILE_IMAGE: 'arc/user/profile_images'
}

export const SETTING_KEYS = {
  LOGO: 'logo',
  MAX_ODDS: 'maxOdds',
  MIN_ODDS: 'minOdds',
  ALLOW_BETTING: 'allowBetting',
  MIN_STAKE_AMOUNT: 'minStakeAmount',
  EXCHANGE_BET_COMMISSION: 'exchangeBetCommission',
  SITE_LAYOUT: 'siteLayout',
  ADMIN_END_URL: 'adminEndUrl',
  USER_END_URL: 'userEndUrl',
  APPLICATION_NAME: 'applicationName',
  MAINTENANCE: 'maintenance',
  CASINO: 'casino',
  DEFAULT_SUPPORT: 'defaultSupport',
  GALLERY: 'gallery',
  REFERRAL: 'referral',
  AMOE_ADDRESS: 'amoEntryAddress',
  PURCHASE_COOLDOWN: 'purchaseCooldown'
}

export const SITE_SETTINGS_KEY_TYPES = {
  DEFAULT_CHAT_SETTINGS: 'defaultChatSettings',
  CHAT_CONFIGURATION: 'chatConfiguration'
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

  static get query () {
    return path.join(this.#basePath, 'query')
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

export const TIME_PERIOD_FILTER = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  LAST_90_DAYS: 'last90days',
  MONTH_TO_DATE: 'monthtodate',
  CUSTOM: 'custom'
}

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'redeem',
  SUBSCRIPTION: 'subscription',
  BONUS: 'bonus',
  ADD_BALANCE: 'addMoney',
  REMOVE_BALANCE: 'removeMoney',
  VAULT_DEPOSIT: 'vaultDeposit',
  VAULT_WITHDRAW: 'vaultWithdraw',
  TOURNAMENT: 'tournament',
  JACKPOT_ENTRY: 'jackpotEntry',
  JACKPOT_WINNER: 'jackpotWinner'
}


export const CASINO_ACTION_TYPE = {
  BALANCE: 'balance',
  BET: 'bet',
  WIN: 'win',
  BET_WIN: 'bet_win',
  CANCEL: 'cancel',
  JACKPOT: 'jackpot',
  CANCEL_BET_WIN: 'cancel_bet_win'
}
