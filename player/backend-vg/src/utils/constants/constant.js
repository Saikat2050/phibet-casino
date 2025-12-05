export const RESPONSIBLE_GAMING_ENDPOINTS = [
  'set-daily-limit',
  'set-loss-limit',
  'set-deposit-limit',
  'set-disable-until',
  'set-session-time'
]

export const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
  USER: 'user'
}
export const CACHE_KEYS = {
  GAMES: 'gamesList',
  BANNER: 'banner',
  CMS: 'cms',
  PROVIDERS: 'providersList',
  FAVORITE_GAMES: 'favoriteGamesList',
  AGGREGATOR: 'aggregator',
  PAYMENTPROVIDER: 'paymentprovider',
  MAINTENANCE: 'maintenance'
}

export const TICKET_TYPE = {
  REDEMPTION: '1',
  EXPIRY: '2',
  FRAUD: '3',
  VERIFICATION: '4'
}

export const TICKET_STATUS = {
  UNASSIGNED: '0',
  PENDING: '1',
  SUCCESS: '2'
}

export const ROLE_ID = {
  ADMIN: 1,
  MANAGER: 2,
  SUPPORT: 3
}

export const DOCUMENTS = {
  ID: 'ID_PROOF',
  ADDRESS: 'ADDRESS_PROOF',
  BANK_CHECKING: 'BANK_CHECKING',
  BANK_SAVINGS: 'BANK_SAVINGS'
}

export const BANK_ACCOUNT_TYPE = {
  CHECKING: '0',
  SAVINGS: '1'
}

export const BREAK_TYPE = {
  TAKE_A_BREAK: 'TAKE_A_BREAK',
  SELF_EXCLUSION: 'SELF_EXCLUSION'
}

export const SELF_EXCLUSION_TYPE = {
  CURRENT: 'current',
  ALL: 'all'
}

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4
}

export const TRANSACTION_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
  FAILED: 3,
  ROLLBACK: 4,
  APPROVED: 5,
  DECLINED: 6,
  INPROGRESS: 7,
  POSTPONE: 8,
  VOID: 9,
  REFUND: 10,
  PUSHCASH: 11
}

export const STATUS_VALUE = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  SUCCESS: 'SUCCESS',
  CANCELLED: 'CANCELED',
  COMPLETED: 'COMPLETED'
}

export const UPLOAD_FILE_SIZE = 5000000
export const OK = 'ok'

export const TYPE = {
  CRYPTO: 'CRYPTO',
  FIAT: 'FIAT',
  CRYPTO_ID: 0,
  FIAT_ID: 1
}

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'redeem',
  BONUS: 'bonus',
  ADD_BALANCE: 'addMoney',
  REMOVE_BALANCE: 'removeMoney',
  VAULT_DEPOSIT: 'vaultDeposit',
  VAULT_WITHDRAW: 'vaultWithdraw'
}

export const GAME_CATEGORY = {
  TABLE_GAME: 'table',
  CASINO_GAME: 'casino'
}

export const GAME_THUMBNAILS = [
  'thumbnailUrl',
  'thumbnailLongUrl',
  'thumbnailShortUrl'
]

export const RESTRICTED_TYPE = {
  PROVIDERS: 'PROVIDERS',
  GAMES: 'GAMES'
}

export const EMAIL_SUBJECTS = {
  emailVerification: 'Verify Your Email',
  verification: 'Identity Verification Requested',
  userActivate: 'Account Activation',
  userDeactivate: 'Account Deactivated',
  kycRejected: 'Kyc Rejected - Action required',
  kycVerified: 'Congratulation Your Kyc Has Been Approved',
  kycApproved: 'Document Approved',
  kycRequested: 'Document Requested for KYC',
  passwordReset: 'Reset your password',
  redeemRequested: 'Redemption Request Received',
  registrationWelcome: 'Welcome To vegasCoins',
  passwordResetConfirmed: 'Password Reset Confirmed',
  phoneVerification: 'Phone Verified Successfully',
  purchaseSuccess: 'Package Purchased Successfully',
  purchaseLimitSet: 'Purchase limit is set',
  timeLimitSet: 'Time limit is set',
  selfExclusion: 'you are self exclude',
  takeBreak: 'Take a break',
  ruleBreak: 'Anti fraud alert'
}

export const CASINO_TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3
}

export const AMOUNT_TYPE = {
  GC_COIN: 0,
  SC_COIN: 1,
  SC_GC_COIN: 2
}

export const WAGERING_TYPE = {
  BONUS: 'bonus',
  BONUSDEPOSIT: 'bonusdeposit'
}

export const BONUS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FORFEIT: 'FORFEITED',
  EXPIRED: 'EXPIRED',
  CLAIMED: 'CLAIMED',
  IN_PROCESS: 'IN-PROCESS',
  LAPSED: 'LAPSED'
}

export const WAGER_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const KEYS = {
  MAX_BONUS_THRESHOLD: 'maxBonusThreshold',
  MIN_DEPOSIT: 'minDeposit',
  MAX_WIN_AMOUNT: 'maxWinAmount',
  ZERO_OUT_THRESHOLD: 'zeroOutThreshold',
  MIN_BALANCE: 'minBalance'
}

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30
}

export const STRICTLY_REQUIRED_REGISTRATION_FIELDS = [
  'email',
  'password',
  'firstName',
  'username',
  'lastName',
  'dateOfBirth',
  'address',
  'gender',
  'countryCode',
  'currencyCode'
]
export const APPROVELY_TRANSACTION_STATUS = {
  UNKNOWN: 'unknown',
  DECLINED: 'Card Payment Declined',
  AUTHORIZED: 'authorized',
  PENDING_SETTLEMENT: 'pending_settlement',
  SETTLED: 'Settled',
  VOIDED: 'voided',
  REFUNDED: 'refunded',
  RETURNED: 'returned',
  LATE_RETURN: 'late_return',
  PENDING: 'pending',
  PARTIALLY_REFUNDED: 'partially_refunded',
  FLAGGED: 'flagged',
  FLAGGED_PARTNER: 'flagged_partner'
}
export const ACCOUNT_TYPE = 'REAL'

export const COUNTRY_CURRENCY_MAPPER = {
  BD: 'BDT',
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BA: 'BAM',
  BB: 'BBD',
  WF: 'XPF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BT: 'BTN',
  JM: 'JMD',
  BV: 'NOK',
  BW: 'BWP',
  WS: 'WST',
  BQ: 'USD',
  BR: 'BRL',
  BS: 'BSD',
  JE: 'GBP',
  BY: 'BYR',
  BZ: 'BZD',
  RU: 'RUB',
  RW: 'RWF',
  RS: 'RSD',
  TL: 'USD',
  RE: 'EUR',
  TM: 'TMT',
  TJ: 'TJS',
  RO: 'RON',
  TK: 'NZD',
  GW: 'XOF',
  GU: 'USD',
  GT: 'GTQ',
  GS: 'GBP',
  GR: 'EUR',
  GQ: 'XAF',
  GP: 'EUR',
  JP: 'JPY',
  GY: 'GYD',
  GG: 'GBP',
  GF: 'EUR',
  GE: 'GEL',
  GD: 'XCD',
  GB: 'GBP',
  GA: 'XAF',
  SV: 'USD',
  GN: 'GNF',
  GM: 'GMD',
  GL: 'DKK',
  GI: 'GIP',
  GH: 'GHS',
  OM: 'OMR',
  TN: 'TND',
  JO: 'JOD',
  HR: 'HRK',
  HT: 'HTG',
  HU: 'HUF',
  HK: 'HKD',
  HN: 'HNL',
  HM: 'AUD',
  VE: 'VEF',
  PR: 'USD',
  PS: 'ILS',
  PW: 'USD',
  PT: 'EUR',
  SJ: 'NOK',
  PY: 'PYG',
  IQ: 'IQD',
  PA: 'PAB',
  PF: 'XPF',
  PG: 'PGK',
  PE: 'PEN',
  PK: 'PKR',
  PH: 'PHP',
  PN: 'NZD',
  PL: 'PLN',
  PM: 'EUR',
  ZM: 'ZMK',
  EH: 'MAD',
  EE: 'EUR',
  EG: 'EGP',
  ZA: 'ZAR',
  EC: 'USD',
  IT: 'EUR',
  VN: 'VND',
  SB: 'SBD',
  ET: 'ETB',
  SO: 'SOS',
  ZW: 'ZWL',
  SA: 'SAR',
  ES: 'EUR',
  ER: 'ERN',
  ME: 'EUR',
  MD: 'MDL',
  MG: 'MGA',
  MF: 'EUR',
  MA: 'MAD',
  MC: 'EUR',
  UZ: 'UZS',
  MM: 'MMK',
  ML: 'XOF',
  MO: 'MOP',
  MN: 'MNT',
  MH: 'USD',
  MK: 'MKD',
  MU: 'MUR',
  MT: 'EUR',
  MW: 'MWK',
  MV: 'MVR',
  MQ: 'EUR',
  MP: 'USD',
  MS: 'XCD',
  MR: 'MRO',
  IM: 'GBP',
  UG: 'UGX',
  TZ: 'TZS',
  MY: 'MYR',
  MX: 'MXN',
  IL: 'ILS',
  FR: 'EUR',
  IO: 'USD',
  SH: 'SHP',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NA: 'NAD',
  VU: 'VUV',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NZ: 'NZD',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  CK: 'NZD',
  XK: 'EUR',
  CI: 'XOF',
  CH: 'CHF',
  CO: 'COP',
  CN: 'CNY',
  CM: 'XAF',
  CL: 'CLP',
  CC: 'AUD',
  CA: 'CAD',
  CG: 'XAF',
  CF: 'XAF',
  CD: 'CDF',
  CZ: 'CZK',
  CY: 'EUR',
  CX: 'AUD',
  CR: 'CRC',
  CW: 'ANG',
  CV: 'CVE',
  CU: 'CUP',
  SZ: 'SZL',
  SY: 'SYP',
  SX: 'ANG',
  KG: 'KGS',
  KE: 'KES',
  SS: 'SSP',
  SR: 'SRD',
  KI: 'AUD',
  KH: 'KHR',
  KN: 'XCD',
  KM: 'KMF',
  ST: 'STD',
  SK: 'EUR',
  KR: 'KRW',
  SI: 'EUR',
  KP: 'KPW',
  KW: 'KWD',
  SN: 'XOF',
  SM: 'EUR',
  SL: 'SLL',
  SC: 'SCR',
  KZ: 'KZT',
  KY: 'KYD',
  SG: 'SGD',
  SE: 'SEK',
  SD: 'SDG',
  DO: 'DOP',
  DM: 'XCD',
  DJ: 'DJF',
  DK: 'DKK',
  VG: 'USD',
  DE: 'EUR',
  YE: 'YER',
  DZ: 'DZD',
  US: 'USD',
  UY: 'UYU',
  YT: 'EUR',
  UM: 'USD',
  LB: 'LBP',
  LC: 'XCD',
  LA: 'LAK',
  TV: 'AUD',
  TW: 'TWD',
  TT: 'TTD',
  TR: 'TRY',
  LK: 'LKR',
  LI: 'CHF',
  LV: 'EUR',
  TO: 'TOP',
  LT: 'LTL',
  LU: 'EUR',
  LR: 'LRD',
  LS: 'LSL',
  TH: 'THB',
  TF: 'EUR',
  TG: 'XOF',
  TD: 'XAF',
  TC: 'USD',
  LY: 'LYD',
  VA: 'EUR',
  VC: 'XCD',
  AE: 'AED',
  AD: 'EUR',
  AG: 'XCD',
  AF: 'AFN',
  AI: 'XCD',
  VI: 'USD',
  IS: 'ISK',
  IR: 'IRR',
  AM: 'AMD',
  AL: 'ALL',
  AO: 'AOA',
  AQ: '',
  AS: 'USD',
  AR: 'ARS',
  AU: 'AUD',
  AT: 'EUR',
  AW: 'AWG',
  IN: 'INR',
  AX: 'EUR',
  AZ: 'AZN',
  IE: 'EUR',
  ID: 'IDR',
  UA: 'UAH',
  QA: 'QAR',
  MZ: 'MZN'
}

export const LIMIT_TIME_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const EMAIL_TEMPLATE_PRIMARY_STATUS = {
  PRIMARY: 1,
  DISABLE: 0,
  alias: {
    0: 'disable',
    1: 'primary'
  }
}

export const EMAIL_TEMPLATE_TYPES = {
  ACTIVE_USER: 'Active User',
  IN_ACTIVE_USER: 'In-Active User',
  EMAIL_VERIFICATION: 'Email Verification',
  RESET_PASSWORD: 'Reset Password',
  KYC_REJECTED: 'KYC Rejected',
  KYC_VERIFIED: 'KYC Verified',
  KYC_REQUESTED: 'KYC Requested',
  KYC_REMINDER: 'KYC Reminder',
  KYC_RECEIVED: 'KYC Received',
  KYC_APPROVED: 'KYC Approved',
  WITHDRAW_REQUEST_RECEIVED: 'Redeem Request Received',
  WITHDRAW_APPROVED: 'Redeem Approved',
  DEPOSIT_SUCCESS: 'Purchase Success',
  REGISTRATION_WELCOME: 'Registration Welcome',
  PHONE_VERIFICATION: 'Phone Verification',
  PASSWORD_RESET_CONFIRMED: 'Password Reset Confirmed',
  IDENTITY_VERIFICATION: 'Identity Verification',
  SUCCESSFUL_IDENTITY_VERIFICATION: 'Successful Identity Verification',
  RESPONSIBLE_GAMBLING_PURCHASE_LIMIT: 'Responsible Gaming Purchase Limit',
  RESPONSIBLE_GAMBLING_TAKE_A_BREAK: 'Responsible Gaming Take a Break',
  RESPONSIBLE_GAMBLING_SESSION_REMINDER: 'Responsible Gaming Session Redminder',
  RESPONSIBLE_GAMBLING_TIME_LIMIT: 'Responsible Gaming Time Limit',
  RESPONSIBLE_GAMBLING_SELF_EXCLUSION: 'Responsible Gaming Self Exclusion',
  RESPONSIBLE_GAMBLING_SETTING_CHANGE: 'Responsible Gaming Setting Change',
  ANTI_FRAUD_ALERT_TYPE: 'Anti fraud alert',
  VALUE_T0_INT: {
    'Active User': 0,
    'In-Active User': 1,
    'Email Verification': 2,
    'Reset Password': 3,
    'KYC Rejected': 4,
    'KYC Verified': 5,
    'KYC Requested': 6,
    'KYC Reminder': 7,
    'KYC Received': 8,
    'KYC Approved': 9,
    'Redeem Request Received': 10,
    'Redeem Approved': 11,
    'Purchase Success': 12,
    'Registration Welcome': 13,
    'Phone Verification': 14,
    'Password Reset Confirmed': 15,
    'Identity Verification': 16,
    'Successful Identity Verification': 17,
    'Responsible Gaming Purchase Limit': 18,
    'Responsible Gaming Take a Break': 19,
    'Responsible Gaming Session Redminder': 20,
    'Responsible Gaming Time Limit': 21,
    'Responsible Gaming Self Exclusion': 22,
    'Responsible Gaming Setting Change': 23
  },
  INT_TO_VALUE: {
    0: 'Active User',
    1: 'In-Active User',
    2: 'Email Verification',
    3: 'Reset Password',
    4: 'KYC Rejected',
    5: 'KYC Verified',
    6: 'KYC Requested',
    7: 'KYC Reminder',
    8: 'KYC Received',
    9: 'KYC Approved',
    10: 'Redeem Request Received',
    11: 'Redeem Approved',
    12: 'Purchase Success',
    13: 'Registration Welcome',
    14: 'Phone Verification',
    15: 'Password Reset Confirmed',
    16: 'Identity Verification',
    17: 'Successful Identity Verification',
    18: 'Responsible Gaming Purchase Limit',
    19: 'Responsible Gaming Take a Break',
    20: 'Responsible Gaming Session Redminder',
    21: 'Responsible Gaming Time Limit',
    22: 'Responsible Gaming Self Exclusion',
    23: 'Responsible Gaming Setting Change'
  }
}

export const EMAIL_TEMPLATE_ORDER = [
  'Manual',
  'Email Verification',
  'Phone Verification',
  'Registration Welcome',
  'Reset Password',
  'Password Reset Confirmed',
  'Identity Verification',
  'Successful Identity Verification',
  'Responsible Gaming Purchase Limit',
  'Responsible Gaming Take a Break',
  'Responsible Gaming Session Redminder',
  'Responsible Gaming Time Limit',
  'Responsible Gaming Self Exclusion',
  'Responsible Gaming Setting Change',
  'Active User',
  'In-Active User',
  'KYC Verified',
  'KYC Rejected',
  'KYC Requested',
  'KYC Reminder',
  'KYC Received',
  'KYC Approved',
  'Redeem Request Received',
  'Redeem Approved',
  'Purchase Success'
]

export const EMAIL_ALLOWED_KEYS = [
  'SiteName',
  'siteLogo',
  'subject',
  'userName',
  'walletAmountTotal',
  'walletAmountBonus',
  'walletAmountReal',
  'siteUrl',
  'reason',
  'link',
  'redeemAmount',
  'depositAmount',
  'transactionId',
  'playerEmail',
  'playerFullName',
  'playerFirstName',
  'playerLastName',
  'supportEmailAddress',
  'kycLabels',
  'siteLoginUrl',
  'playerCurrencySymbol',
  'sendSupportRequestRoute',
  'redeemRequestedDate',
  'scCoin',
  'gcCoin',
  'currentDate',
  'paymentType',
  'value',
  'identifier'
]

export const EMAIL_TEMPLATES_KEYS = {
  0: {
    required: ['siteName', 'siteUrl', 'siteLogo'],
    optional: [
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal'
    ]
  },
  1: {
    required: ['siteName', 'siteUrl', 'siteLogo', 'reason'],
    optional: [
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal'
    ]
  },
  2: {
    required: ['link', 'userName', 'playerEmail'],
    optional: [
      'siteName',
      'siteUrl',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress'
    ]
  },
  3: {
    required: ['link'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol'
    ]
  },
  4: {
    required: ['kycLabels', 'reason'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  5: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  6: {
    required: ['kycLabels'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  7: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  8: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  9: {
    required: ['kycLabels'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  10: {
    required: [
      'redeemRequestedDate',
      'redeemAmount',
      'transactionId',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  11: {
    required: [
      'redeemRequestedDate',
      'redeemAmount',
      'transactionId',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  12: {
    required: [
      'transactionId',
      'depositAmount',
      'scCoin',
      'gcCoin',
      'currentDate',
      'paymentType',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'sendSupportRequestRoute',
      'playerCurrencySymbol'
    ]
  },
  13: {
    required: ['siteUrl', 'userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  14: {
    required: ['siteUrl', 'userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  15: {
    required: ['userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  16: {
    required: ['userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  17: {
    required: ['userName', 'siteUrl'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  18: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  19: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  20: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  21: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  22: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  23: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  }
}

export const EMAIL_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by site's Logo URL"
  },
  {
    key: 'subject',
    description: 'If not given, default subject line will be used'
  },
  {
    key: 'userName',
    description: "This will be replaced by User's unique username"
  },
  {
    key: 'walletAmountTotal',
    description: "This will be replaced by User's total wallet amount"
  },
  {
    key: 'walletAmountBonus',
    description: "This will be replaced by User's non-cash wallet amount"
  },
  {
    key: 'walletAmountReal',
    description: "This will be replaced by User's cash wallet amount"
  },
  {
    key: 'siteUrl',
    description: "This will be replaced by site's URL"
  },
  {
    key: 'reason',
    description: 'This will be replaced by valid reason for triggering email'
  },
  {
    key: 'link',
    description:
      'Dynamically generated link from backend (Reset Password, Email Confirmation)'
  },
  {
    key: 'redeemAmount',
    description: 'This will be replaced by redeem request amount'
  },
  {
    key: 'depositAmount',
    description: 'This will be replaced by deposit amount'
  },
  {
    key: 'transactionId',
    description:
      'This will be replaced by transaction Id for (Deposit / Redeem)'
  },
  {
    key: 'playerEmail',
    description: "This will be replaced by player's email address"
  },
  {
    key: 'playerFullName',
    description:
      "This will be replaced by player's full name (first name + last name)"
  },
  {
    key: 'playerFirstName',
    description: "This will be replaced by player's first name"
  },
  {
    key: 'playerLastName',
    description: "This will be replaced by player's last name"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  },
  {
    key: 'kycLabels',
    description:
      'This will be replaced by kyc label for pending, approved, rejected'
  },
  {
    key: 'siteLoginUrl',
    description: 'This will be replaced by user login route'
  },
  {
    key: 'playerCurrencySymbol',
    description: "This will be replaced by user's currency symbol"
  },
  {
    key: 'sendSupportRequestRoute',
    description:
      'This will be replaced by route for compose support email page.'
  },
  {
    key: 'redeemRequestedDate',
    description: 'This will be replaced by requested redeem date.'
  },
  {
    key: 'scCoin',
    description: 'This will be replaced by SC coin value.'
  },
  {
    key: 'gcCoin',
    description: 'This will be replaced by GC coin value.'
  },
  {
    key: 'currentDate',
    description: 'This will be replaced by Current date'
  },
  {
    key: 'paymentType',
    description: 'This will be replaced by payment type used.'
  },
  {
    key: 'value',
    description: 'This will be replaced by deposit value used.'
  },
  {
    key: 'identifier',
    description: 'This will be replaced by identifier used.'
  }
]

export const BONUS_ACTIONS = ['cancel-bonus', 'issue-bonus']

export const CMS_ALLOWED_KEYS = ['siteName', 'siteLogo', 'supportEmailAddress']

export const CMS_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by site's Logo URL"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  }
]

export const MAP_AGGREGATOR = {
  softswiss: 'swissSoft',
  amantic: 'amantic'
}

export const MAP_GENDER = {
  Female: 'f',
  Male: 'm',
  F: 'f',
  M: 'm',
  'Not to say': 'm',
  Other: 'm'
}

export const LEVEL = 1

export const BANNER_KEYS = [
  'homeBanner',
  'homeBackground',
  'loyaltyBanner',
  'loyaltyBackground',
  'promotionsBanner',
  'promotionsBackground',
  'casinoBanner',
  'casinoBackground'
]

export const defaultLanguage = 'EN'

export const BONUS_TYPE = {
  DAILY_BONUS: 'daily-bonus',
  WELCOME_BONUS: 'welcome bonus',
  REFERRAL_BONUS: 'referral-bonus',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  PERSONAL_BONUS: 'personal-bonus',
  TIER_BONUS: 'tier-bonus',
  MONTHLY_TIER_BONUS: 'monthly-tier-bonus',
  WEEKLY_TIER_BONUS: 'weekly-tier-bonus',
  RAFFLE_PAYOUT: 'raffle-payout',
  PROMOTION_BONUS: 'promotion-bonus',
  AFFILIATE_BONUS: 'affiliate-bonus',
  WHEEL_SPIN_BONUS: 'wheel-spin-bonus',
  PACKAGE_BONUS: 'package-bonus',
  DAILY_BONUS_EXPIRE: 'daily bonus expire'
}

export const COUNTRY_CODE_MAPPER = {
  AF: 'AFG',
  AL: 'ALB',
  DZ: 'DZA',
  AS: 'ASM',
  AD: 'AND',
  AO: 'AGO',
  AI: 'AIA',
  AQ: 'ATA',
  AG: 'ATG',
  AR: 'ARG',
  AM: 'ARM',
  AW: 'ABW',
  AU: 'AUS',
  AT: 'AUT',
  AZ: 'AZE',
  BS: 'BHS',
  BH: 'BHR',
  BD: 'BGD',
  BB: 'BRB',
  BY: 'BLR',
  BE: 'BEL',
  BZ: 'BLZ',
  BJ: 'BEN',
  BM: 'BMU',
  BT: 'BTN',
  BO: 'BOL',
  BQ: 'BES',
  BA: 'BIH',
  BW: 'BWA',
  BV: 'BVT',
  BR: 'BRA',
  IO: 'IOT',
  BN: 'BRN',
  BG: 'BGR',
  BF: 'BFA',
  BI: 'BDI',
  CV: 'CPV',
  KH: 'KHM',
  CM: 'CMR',
  CA: 'CAN',
  KY: 'CYM',
  CF: 'CAF',
  TD: 'TCD',
  CL: 'CHL',
  CN: 'CHN',
  CX: 'CXR',
  CC: 'CCK',
  CO: 'COL',
  KM: 'COM',
  CD: 'COD',
  CG: 'COG',
  CK: 'COK',
  CR: 'CRI',
  HR: 'HRV',
  CU: 'CUB',
  CW: 'CUW',
  CY: 'CYP',
  CZ: 'CZE',
  CI: 'CIV',
  DK: 'DNK',
  DJ: 'DJI',
  DM: 'DMA',
  DO: 'DOM',
  EC: 'ECU',
  EG: 'EGY',
  SV: 'SLV',
  GQ: 'GNQ',
  ER: 'ERI',
  EE: 'EST',
  SZ: 'SWZ',
  ET: 'ETH',
  FK: 'FLK',
  FO: 'FRO',
  FJ: 'FJI',
  FI: 'FIN',
  FR: 'FRA',
  GF: 'GUF',
  PF: 'PYF',
  TF: 'ATF',
  GA: 'GAB',
  GM: 'GMB',
  GE: 'GEO',
  DE: 'DEU',
  GH: 'GHA',
  GI: 'GIB',
  GR: 'GRC',
  GL: 'GRL',
  GD: 'GRD',
  GP: 'GLP',
  GU: 'GUM',
  GT: 'GTM',
  GG: 'GGY',
  GN: 'GIN',
  GW: 'GNB',
  GY: 'GUY',
  HT: 'HTI',
  HM: 'HMD',
  VA: 'VAT',
  HN: 'HND',
  HK: 'HKG',
  HU: 'HUN',
  IS: 'ISL',
  IN: 'IND',
  ID: 'IDN',
  IR: 'IRN',
  IQ: 'IRQ',
  IE: 'IRL',
  IM: 'IMN',
  IL: 'ISR',
  IT: 'ITA',
  JM: 'JAM',
  JP: 'JPN',
  JE: 'JEY',
  JO: 'JOR',
  KZ: 'KAZ',
  KE: 'KEN',
  KI: 'KIR',
  KP: 'PRK',
  KR: 'KOR',
  KW: 'KWT',
  KG: 'KGZ',
  LA: 'LAO',
  LV: 'LVA',
  LB: 'LBN',
  LS: 'LSO',
  LR: 'LBR',
  LY: 'LBY',
  LI: 'LIE',
  LT: 'LTU',
  LU: 'LUX',
  MO: 'MAC',
  MG: 'MDG',
  MW: 'MWI',
  MY: 'MYS',
  MV: 'MDV',
  ML: 'MLI',
  MT: 'MLT',
  MH: 'MHL',
  MQ: 'MTQ',
  MR: 'MRT',
  MU: 'MUS',
  YT: 'MYT',
  MX: 'MEX',
  FM: 'FSM',
  MD: 'MDA',
  MC: 'MCO',
  MN: 'MNG',
  ME: 'MNE',
  MS: 'MSR',
  MA: 'MAR',
  MZ: 'MOZ',
  MM: 'MMR',
  NA: 'NAM',
  NR: 'NRU',
  NP: 'NPL',
  NL: 'NLD',
  NC: 'NCL',
  NZ: 'NZL',
  NI: 'NIC',
  NE: 'NER',
  NG: 'NGA',
  NU: 'NIU',
  NF: 'NFK',
  MP: 'MNP',
  NO: 'NOR',
  OM: 'OMN',
  PK: 'PAK',
  PW: 'PLW',
  PS: 'PSE',
  PA: 'PAN',
  PG: 'PNG',
  PY: 'PRY',
  PE: 'PER',
  PH: 'PHL',
  PN: 'PCN',
  PL: 'POL',
  PT: 'PRT',
  PR: 'PRI',
  QA: 'QAT',
  MK: 'MKD',
  RO: 'ROU',
  RU: 'RUS',
  RW: 'RWA',
  RE: 'REU',
  BL: 'BLM',
  SH: 'SHN',
  KN: 'KNA',
  LC: 'LCA',
  MF: 'MAF',
  PM: 'SPM',
  VC: 'VCT',
  WS: 'WSM',
  SM: 'SMR',
  ST: 'STP',
  SA: 'SAU',
  SN: 'SEN',
  RS: 'SRB',
  SC: 'SYC',
  SL: 'SLE',
  SG: 'SGP',
  SX: 'SXM',
  SK: 'SVK',
  SI: 'SVN',
  SB: 'SLB',
  SO: 'SOM',
  ZA: 'ZAF',
  GS: 'SGS',
  SS: 'SSD',
  ES: 'ESP',
  LK: 'LKA',
  SD: 'SDN',
  SR: 'SUR',
  SJ: 'SJM',
  SE: 'SWE',
  CH: 'CHE',
  SY: 'SYR',
  TW: 'TWN',
  TJ: 'TJK',
  TZ: 'TZA',
  TH: 'THA',
  TL: 'TLS',
  TG: 'TGO',
  TK: 'TKL',
  TO: 'TON',
  TT: 'TTO',
  TN: 'TUN',
  TR: 'TUR',
  TM: 'TKM',
  TC: 'TCA',
  TV: 'TUV',
  UG: 'UGA',
  UA: 'UKR',
  AE: 'ARE',
  GB: 'GBR',
  UM: 'UMI',
  US: 'USA',
  UY: 'URY',
  UZ: 'UZB',
  VU: 'VUT',
  VE: 'VEN',
  VN: 'VNM',
  VG: 'VGB',
  VI: 'VIR',
  WF: 'WLF',
  EH: 'ESH',
  YE: 'YEM',
  ZM: 'ZMB',
  ZW: 'ZWE',
  AX: 'ALA'
}

export const DATE_FORMAT = 'yyyy-MM-DD'

export const ACTION = {
  BONUS: 'bonus',
  WIN: 'win',
  BET: 'bet',
  LOST: 'lost',
  CANCEL: 'cancel',
  ROLLBACK_BEFORE_BET_WIN: 'pre_rollback',
  ROLLBACK: 'rollback',
  FREE_SPINS: 'free_spin',
  TIER_BONUS: 'tier_bonus',
  TIP: 'tip'
}

export const USER_ACTIVITIES_TYPE = {
  SIGNUP: 'sign-up',
  LOGIN: 'login',
  DAILY_BONUS_CLAIMED: 'daily-bonus-claimed',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  DAILY_BONUS_CANCELLED: 'daily-bonus-cancelled',
  WELCOME_BONUS_CLAIMED: 'welcome-bonus-claimed',
  REFERRAL_BONUS_CLAIMED: 'referral-bonus-claimed',
  LOGOUT: 'logout',
  PROMOTION_BONUS_CLAIMED: 'promotion-bonus-claimed',
  AFFILIATE_BONUS_CLAIMED: 'affiliate-bonus-claimed',
  WHEEL_SPIN_BONUS: 'wheel-spin-bonus',
  PROMOCODE_APPLIED: 'promocode-applied'
}

export const ACTION_TYPE = {
  ALL: 'all',
  BONUS: '4',
  LOST: '3',
  CANCEL: '2',
  CREDIT: '1',
  DEBIT: '0',
  PENDING_OR_LOST: null
}

export const LOGICAL_ENTITY = {
  PROVIDER: 'provider',
  SUB_CATEGORY: 'sub-category',
  BANNER: 'banner',
  PACKAGE: 'package',
  USER_PROFILE: 'user-profile'
}
export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
export const OTP_SEND_LIMIT_EXCEED_ERROR_CODE = 60203

export const PAYMENT_METHOD = {
  PAYSAFE: 'PAYSAFE',
  PAY_BY_BANK: 'PAY_BY_BANK',
  APPROVELY: 'APPROVELY',
  PUSHCASH: 'PUSHCASH',
  FINIX: 'FINIX'
}

export const REGEX = {
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_=+[{\]}|;:'",.<>/?]).{8,20}$/,
  USERNAME: /^(?=.*[a-z])[A-Za-z\d_]{5,20}$/
}

export const SEND_EMAIL_TYPES = {
  EMAIL_VERIFICATION: 'email',
  RESET_PASSWORD: 'passwordReset'
}

export const SEND_SMS_TYPES = {
  VERIFICATION_OTP: 'verificationOtp'
}

export const RESPONSIBLE_GAMBLING_STATUS = {
  ACTIVE: '1',
  IN_ACTIVE: '0',
  COOLING_PERIOD: '2'
}

export const RESPONSIBLE_GAMBLING_LIMIT = {
  DAILY: '1',
  WEEKLY: '2',
  MONTHLY: '3'
}

export const RESPONSIBLE_GAMBLING_TYPE = {
  SESSION: '1', // Not Using
  PURCHASE: '2',
  TIME: '3', // Not Using
  TIME_BREAK: '4',
  SELF_EXCLUSION: '5',
  DEPOSIT: '6'
}

export const SIGN_IN_METHOD = {
  NORMAL: '0',
  GOOGLE: '1',
  FACEBOOK: '2',
  APPLE: '3'
}

export const KYC_STATUS = {
  ACCOUNT_CREATED: 'K0',
  ACCOUNT_EMAIL_VERIFIED: 'K1',
  ACCOUNT_PROFILE_COMPLETED: 'K2',
  ACCOUNT_VERIFIED_PHONE: 'K3',
  ACCOUNT_KYC_VERIFIED: 'K4',
  ACCOUNT_FULLY_VERIFIED: 'K5',
  APPROVED: 'K5',
  REJECTED: 'K6',
  REVIEW: 'K7',
  FAIL: 'K8',
  ABANDONED: 'K9'
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

export const G_SOFT_CASINO_ACTIONS = {
  BALANCE: 'getbalance',
  ACCOUNT: 'getaccount',
  BET: 'wager',
  WIN: 'result',
  BET_WIN: 'wagerAndResult',
  CANCEL: 'rollback',
  CANCEL_BET_WIN: 'reversewin',
  JACKPOT: 'jackpot'
}

export const CASINO_CALLBACK_STATUS_CODE = {
  200: '200',
  500: '500',
  401: '401'
}
export const CASINO_CALLBACK_ERRORS_CODE = {
  ERR001: 'ERR001',
  ERR002: 'ERR002',
  ERR003: 'ERR003',
  ERR004: 'ERR004',
  ERR005: 'ERR005',
  ERR006: 'ERR006',
  ERR007: 'ERR007',
  ERR008: 'ERR008',
  ERR009: 'ERR009',
  ERR010: 'ERR010'
}

export const CASINO_CALLBACK_ERRORS_MESSAGE = {
  ERR001: 'Unknown error occurred.',
  ERR002: 'The session has timed out. Please login again to continue playing.',
  ERR003:
    'Insufficient funds to place current wager. Please reduce the stake or add more funds to your balance.',
  ERR004:
    'This wagering will exceed your wagering limitation. Please try a smaller amount or increase the limit.',
  ERR005: 'Player authentication failed.',
  ERR006: 'Unauthorized request.',
  ERR007: 'Duplicate transaction request.',
  ERR008: 'Unsupported currency.',
  ERR009: 'Bonus bet max restriction.',
  ERR010: 'Transaction not found.'
}

export const CASINO_DEFAULT_ERROR = {
  status: CASINO_CALLBACK_STATUS_CODE[500],
  error: {
    code: CASINO_CALLBACK_ERRORS_CODE.ERR001,
    message: CASINO_CALLBACK_ERRORS_MESSAGE.ERR001,
    display: true
  }
}

export const THUMBNAIL_TYPE = {
  MOBILE: 'mobile',
  SHORT: 'short',
  LONG: 'long'
}

export const POSTAL_CODE = {
  POSTAL_CODE_TIME: 5, // time in minute
  POSTAL_CODE_VALID_TILL: 15 // time in days
}

export const EMAIL_LOGS_SOURCE = {
  SMS: 'SMS',
  PUSH: 'push',
  TRANSACTIONAL: 'transactional',
  VERIFICATION: 'verification',
  CRM: 'CRM'
}

export const POSTAL_CODE_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2
}

export const SIGN_UP_METHOD = {
  EMAIL: 0,
  GOOGLE: 1,
  FACEBOOK: 2,
  APPLE: 3,
  PHONE: 4
}

export const RULE_ACTIVITIES = {
  REDEMPTIONS: 1,
  LOGIN: 2,
  REGISTRATION: 3,
  PURCHASE: 4,
  WIN: 5
}

export const RULE_NAME = {
  1: 'REDEMPTIONS',
  2: 'LOGIN',
  3: 'REGISTRATION',
  4: 'PURCHASE',
  5: 'WIN'
}

export const RULE_IDENTIFIER = {
  SAME_IP: 'Same ip address during login',
  SAME_DEVICE: 'Same ip address during login',
  SAME_NAME: 'Same last and first name',
  SAME_ADDRESS: 'Same addresses',
  WIN_COUNT: 'Win counts is exceed',
  WIN_SINGLE: 'Single day win amount exceed',
  WIN_SUM: 'Win sum amount exceed',
  PURCHASE_SINGLE: 'Single day purchase amount exceed',
  PURCHASE_SUM: 'Purchase sum amount exceed',
  REDEEM__SINGLE: 'Single day redemption amount exceed',
  REDEEM__SUM: 'Redemption sum amount exceed'
}

export const PAGE_ASSET_TYPE = {
  TEXT: '1',
  DIGITAL: '2',
  MESSAGE: '3'
}

export const EMAIL_TEMPLATES = {
  VERIFY_EMAIL: {
    name: 'Verify Email',
    templateId: 'd-7e04e26fa0e04963ab27c1803e4c65a0'
  },
  FORGET_PASSWORD: {
    name: 'Forget Password',
    templateId: 'd-365967e9558e4960b3f3fc4ffc6a8f3d'
  },
  VERIFY_FORGET_PASSWORD: {
    name: 'Verify Forget Password',
    templateId: 'd-c3aaac4efc1f49c49fc169d9f21e8a57'
  },
  VERIFY_OTP: {
    name: 'Verify Otp',
    templateId: 'd-b0009f0f09fc4801ac3fe1eff6cd0738'
  },
  WELCOME_MAIL: {
    name: 'Welcome Mail',
    templateId: 'd-e4583de704644291bdaa83aa2a29391d'
  },
  PROFILE_UPDATED: {
    name: 'Profile Updated',
    templateId: 'd-6b34fd1cb64240788080440f3ced3a11'
  },
  REDEEM_REQUEST: {
    name: 'Redeem Request',
    templateId: 'd-058063a55b06456888fe757775c692a0'
  },
  USER_FEEDBACK: {
    name: 'User Feedback',
    templateId: 'd-42ff3c3e23904a82bdff118356d0823e'
  },
  SELF_EXCLUSION: {
    name: 'Blocked Account Responsible Gaming',
    templateId: 'd-381f55b1535148e2bc97e0a765be3f5c'
  },
  DEPOSIT: {
    name: 'Deposit Mail',
    templateId: 'd-e87e79df51bc43f69d7776b5e4df0fb2'
  }
}

export const AGGREGATORS = {
  GSOFT: 'gsoft',
  ALEA: 'alea',
  BETERLIVE: 'beterlive',
  BOOMING: 'booming',
  TINYREX: 'tinyrex'
}

export const ALEA_PLAY_CASINO_TYPES = {
  BET: 'BET',
  WIN: 'WIN',
  BET_WIN: 'BET_WIN',
  ROLLBACK: 'ROLLBACK',
  BALANCE: 'BALANCE'
}

export const TOURNAMENT_STATUS = {
  UPCOMING: 0,
  RUNNING: 1,
  COMPLETED: 2,
  CANCELLED: 3
}

export const RAFFLE_STATUS = {
  COMPLETED: 'COMPLETED',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  RUNNING: 'RUNNING',
  UPCOMING: 'UPCOMING'
}

export const PROMOTION_EVENT_STATUS = {
  PROMO_CREATED: 0,
  USER_REGISTERED: 1,
  BONUS_AVAILED: 2
}

export const ALEA_PROVIDERS = {
  PRAGMATIC_PLAY: 'PRAGMATIC PLAY'
}

export const TWO_FACTOR_AUTH = {
  issuer: 'vegasCoins',
  label: 'vegasCoins',
  algorithm: 'SHA1',
  digits: 6,
  period: 30
}

export const REGION_ALLOWED_ROUTES = {
  SIGN_UP: '/sign-up',
  GOOGLE_LOGIN: '/googleLogin',
  LOGIN: '/login',
  APPLE_LOGIN: '/appleLogin',
  ACCESS_ALLOW: '/accessAllowed',
  DAILY_BONUS: '/daily-bonus',
  WELCOME_BONUS: '/welcome-bonus',
  PROMOTION_BONUS: '/promotion-bonus',
  INIT_PAY: '/init-pay',
  FACEBOOK_LOGIN: '/facebookLogin',
  PHONE_VERIFICATION: '/phoneVerify',
  UPDATE_PROFILE: '/profile'
}

export const PAYSAFE_PAYMENT_HANDLE_EVENTS = [
  'PAYMENT_HANDLE_FAILED',
  'PAYMENT_HANDLE_EXPIRED',
  'PAYMENT_HANDLE_ERRORED',
  'PAYMENT_HANDLE_DELETED',
  'PAYMENT_EXPIRED',
  'PAYMENT_FAILED'
]

export const PUSHCASH_TRANSACTION_STATUS = {
  APPROVED: 'intent.approved',
  DECLINED: 'intent.declined',
  SETTLED: 'intent.settled'
}

export const FINIX_ROLES = {
  BUYER: 'BUYER',
  RECIPIENT: 'RECIPIENT'
}

export const FINIX_STATUS = {
  SUCCEEDED: 'SUCCEEDED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  UNKNOWN: 'UNKNOWN'
}

export const FINIX_MESSAGES = {
  SUCCEEDED: 'Your Deposit Was Successful. Coins Will Be Added To Your Balance Momentarily.',
  PENDING: 'Your Request Is Being Processed. Please Wait A Moment While We Complete The Transfer. If This Takes Too Long, Please Reach Out To Customer Support.',
  FAILED: 'Your Transaction Could Not Be Completed. Please Try Again Shortly. If The Problem Persists, Please Reach Out To Customer Support.',
  CANCELED: 'Unfortunately Your Deposit Was Declined. Please Reach Out To Customer Support.',
  UNKNOWN: 'An Unexpected Issue Occurred During The Transfer. Please Retry Or Reach Out To Customer Support.'
}

export const FINIX_SUCCESS_MESSAGE = 'Your payment has been done. The amount will reflect in your wallet shortly'
export const FINIX_PENDING_MESSAGE = 'Its taking some time to process your request. please wait for some time'
export const FINIX_CANCELLED_MESSAGE = 'Your transaction has been canceled. Please retry'
export const FINIX_FAILED_MESSAGE = 'Your payment was declined. Please contact your card issuer'
export const FINIX_UNKNOWN_MESSAGE = 'A connection or timeout issue occurred while the Transfer got created or updated. Reattempt the Transfer.'

export const SOKUL_KYC_STATUS = {
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_EMAIL_VERIFIED: 'account_email_verified',
  ACCOUNT_PROFILE_COMPLETED: 'account_profile_completed',
  ACCOUNT_VERIFIED_PHONE: 'account_verified_phone',
  ACCOUNT_KYC_VERIFIED: 'account_kyc_verified',
  ACCOUNT_FULLY_VERIFIED: 'account_fully_verified',
  APPROVED: 'account_fully_verified',
  REJECTED: 'rejected',
  REVIEW: 'review',
  FAIL: 'fail',
  ABANDONED: 'abandoned'
}

export const FINIX_PROVIDERS = {
  APPLE_PAY: 'APPLE_PAY'
}
