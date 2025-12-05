// Currency constants start
export const CURRENCY_TYPES = {
  GOLD_COIN: 'gold-coin',
  SWEEP_COIN: 'sweep-coin'
}

export const SWEEPS_COINS = {
  GC: 'GC',
  BSC: 'BSC',
  PSC: 'PSC',
  RSC: 'RSC',
  SC: 'SC'
}
// Currency constants

export const LEDGER_TRANSACTION_TYPE = {
  CASINO: 'casino',
  STANDARD: 'standard',
  WITHDRAWAL: 'withdrawal',
  PURCHASE: 'purchase',
  REDEEM: 'redeem'
}

export const AMOE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

// Ledger constants start
export const LEDGER_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit'
}

// ledger constants start
export const LEDGER_PURPOSE = {
  REDEEEM_FAILED: 'RedeemFailed',               // from old
  REDEEM_REJECTED: 'RedeemRejected',            // from old
  PURCHASE: 'Purchase',
  AMOE: 'AmoEntry',                             // new
  PURCHASE_GC_COIN: 'PurchaseGcCoin',
  PURCHASE_SC_COIN: 'PurchaseScCoin',
  PURCHASE_GC_BONUS: 'PurchaseGcBonus',
  PURCHASE_SC_BONUS: 'PurchaseScBonus',
  REFUND: 'Refund',
  REDEEM: 'Redeem',
  WINNINGS: 'Winnings',
  CASINO_BET: 'CasinoBet',
  CASINO_WIN: 'CasinoWin',
  CASINO_REFUND: 'CasinoRefund',
  CASINO_BET_ROLLBACK: 'CasinoBetRollback',
  CASINO_WIN_ROLLBACK: 'CasinoWinRollback',
  REFERRAL_DEPOSIT: 'ReferralDeposit',          // credit
  BONUS_CASHED: 'BonusCashed',
  BONUS_DEPOSIT: 'BonusDeposit',
  ADD_COIN: 'AddCoin',                          // credit
  REMOVE_COIN: 'RemoveCoin',                    // debit
  VIP_TIER_WEEKLY_BONUS: 'VipTierWeeklyBonus',
  VIP_TIER_MONTHLY_BONUS: 'VipTierMonthlyBonus',
  VIP_TIER_TIER_UP_BONUS: 'VipTierTierUpBonus',
  VIP_TIER_RAKEBACK_BONUS: 'VipTierRakebackBonus',
  DAILY_BONUS: 'DAILY_BONUS',
  JOINING_BONUS: 'JOINING_BONUS',
  BIRTHDAY_BONUS: 'BIRTHDAY_BONUS',
  WELCOME_BONUS: 'WELCOME_BONUS',               // from old
  SPIN_WHEEL_SC: 'spinWheelSc',                 // credit
  SPIN_WHEEL_GC: 'spinWheelGc',                 // credit
  CHAT_RAIN_GRAB_GC: 'chatRainGrabGc',          // credit
  CHAT_RAIN_GRAB_BSC: 'chatRainGrabBsc',        // credit
  GIVE_TIP_GC: 'giveTipGc',                     // debit
  GIVE_TIP_BSC: 'giveTipBsc',                   // debit
  RECEIVE_TIP_BSC: 'receiveTipBsc',             // credit
  RECEIVE_TIP_GC: 'receiveTipGc',               // credit
  VAULT_DEPOSIT: 'vaultDeposit',
  VAULT_REDEEM: 'vaultRedeem'
}


export const LEDGER_RULES = {
  [LEDGER_PURPOSE.RECEIVE_TIP_GC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.RECEIVE_TIP_BSC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CHAT_RAIN_GRAB_GC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CHAT_RAIN_GRAB_BSC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CHAT_RAIN_GRAB_GC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CHAT_RAIN_GRAB_BSC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.SPIN_WHEEL_GC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.SPIN_WHEEL_SC]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.PURCHASE]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.PURCHASE_GC_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.PURCHASE_GC_COIN]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.PURCHASE_SC_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.PURCHASE_SC_COIN]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.REDEEM]: LEDGER_TYPES.DEBIT,
  [LEDGER_PURPOSE.REDEEEM_FAILED]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CASINO_BET]: LEDGER_TYPES.DEBIT,
  [LEDGER_PURPOSE.REFUND]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.REDEEM]: LEDGER_TYPES.DEBIT,
  [LEDGER_PURPOSE.CASINO_WIN_ROLLBACK]: LEDGER_TYPES.DEBIT,
  [LEDGER_PURPOSE.CASINO_BET_ROLLBACK]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CASINO_WIN]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.CASINO_REFUND]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.BONUS_CASHED]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.REFERRAL_DEPOSIT]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.VIP_TIER_WEEKLY_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.VIP_TIER_MONTHLY_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.VIP_TIER_RAKEBACK_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.DAILY_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.JOINING_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.VAULT_DEPOSIT]: LEDGER_TYPES.DEBIT,
  [LEDGER_PURPOSE.VAULT_REDEEM]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.WELCOME_BONUS]: LEDGER_TYPES.CREDIT,
  [LEDGER_PURPOSE.BIRTHDAY_BONUS]: LEDGER_TYPES.CREDIT


}
// Ledger constants end

// Transaction constants start
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  SUCCESS: 'success'
}

export const ACTION = {
  BONUS: 'bonus',
  WIN: 'win',
  BET: 'bet',
  LOST: 'lost',
  CANCEL: 'cancel',
  ROLLBACKBEFOREBETWIN: 'prerollback',
  FREESPINS: 'freespins',
  TIER_BONUS: 'tier_bonus',
  ROLLBACK: 'rollback',
  JACKPOT: 'jackpot'
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
// Transaction constants end

// Document constants start
export const DOCUMENT_STATUS_TYPES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUESTED: 'requested'
}
// Document constants end

// Setting constants start
export const SETTING_DATA_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  PERCENTAGE: 'percentage',
  JSON: 'json'
}
// Setting constants end

// User constants start
export const USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES = {
  SELF_EXCLUSION: 'self_exclusion',
  DAILY_BET_LIMIT: 'daily_bet_limit',
  WEEKLY_BET_LIMIT: 'weekly_bet_limit',
  MONTHLY_BET_LIMIT: 'monthly_bet_limit',
  DAILY_LOSS_LIMIT: 'daily_loss_limit',
  WEEKLY_LOSS_LIMIT: 'weekly_loss_limit',
  MONTHLY_LOSS_LIMIT: 'monthly_loss_limit',
  DAILY_DEPOSIT_LIMIT: 'daily_deposit_limit',
  WEEKLY_DEPOSIT_LIMIT: 'weekly_deposit_limit',
  MONTHLY_DEPOSIT_LIMIT: 'monthly_deposit_limit'
}

export const SELF_EXCLUSION_TYPES = {
  PERMANENT: 'permanent',
  TEMPORARY: 'temporary'
}

export const USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES = {
  ENUM: 'enum',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
  PERCENTAGE: 'percentage'
}

export const RESPONSIBLE_GAMBLING_DATA_TYPE_MAPPING = {
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.SELF_EXCLUSION]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.ENUM,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_BET_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.INTEGER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_BET_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.INTEGER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_BET_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.INTEGER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_DEPOSIT_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.NUMBER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_DEPOSIT_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.NUMBER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_DEPOSIT_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.NUMBER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_LOSS_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.NUMBER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_LOSS_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.NUMBER,
  [USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_LOSS_LIMIT]: USER_RESPONSIBLE_GAMBLING_LIMIT_DATA_TYPES.NUMBER
}

export const USER_GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown'
}

export const PAYMENT_CARD_TYPES = {
  VISA: 'VISA',
  MASTERCARD: 'MASTERCARD',
  AMEX: 'AMEX',
  DISCOVER: 'DISCOVER',
  OTHER: 'OTHER'
}
// User constants end

// Withdrawal constants start
export const WITHDRAWAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const WITHDRAWAL_TYPES = {
  BANK: 'bank',
  CRTPTO: 'crypto'
}
// Withdrawal constants end

// Banner constants start
export const BANNER_TYPES = {
  HOME: 'home',
  STORE: 'store',
  PROMOTIONS: 'promotions'
}
// Banner constants end

// AMOUNT_TYPES
export const AMOUNT_TYPES = {
  CASH: 'cash',
  BONUS: 'bonus',
  BONUS_PLUS_CASH: 'bonus_plus_cash'
}

export const ACTIVE_BONUS_KEY_SUFFIX = '-active-bonus-details'

// QUERY_STATUS constants start
export const QUERY_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  REOPENED: 'reopened'
}
// QUERY_STATUS constants end
// Message constant
export const DELETED_MESSAGE = 'Deleted because of offensive content.'
export const GLOBAL_GROUP_ID = 1

export const SUCCESS_MSG = {
  JOINED_SUCCESS: 'Joined successfully',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFY: 'OTP verified successfully',
  OTP_RESENT: 'OTP resent successfully'
}

export const GROUP_CRITERIA = {
  KYC_CRITERIA: 'KYC_CRITERIA',
  WAGERING_CRITERIA: 'WAGERING_CRITERIA',
  RANKING_LEVEL_CRITERIA: 'RANKING_LEVEL_CRITERIA'
}

export const GROUP_CRITERIA_ARRAY = ['KYC_CRITERIA', 'WAGERING_CRITERIA', 'RANKING_LEVEL_CRITERIA']

export const MESSAGE_TYPE = {
  MESSAGE: 'MESSAGE',
  SHARED_EVENT: 'EVENT',
  GIF: 'GIF',
  TIP: 'TIP',
  CHAT_RAIN: 'CHAT_RAIN'
}

// PROVIDER_TYPE constants start
export const PROVIDER_TYPE = {
  PAYMENT: 'payment',
  CASINO: 'casino',
  CRM: 'crm',
  OTHER: 'other'
}

// OTP expiry time in seconds
export const OTP_EXPIRY_TIME = 600

// Time window for tracking login failures in minutes
export const LOGIN_FAILURE_TIME_SPAN = 30

export const USER_ACTIVITY = {
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN: 'LOGIN'
}

export const SIGN_IN_METHOD = {
  EMAIL: 'email',
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
}

export const SPIN_WHEEL_TIME_LIMIT_HOURS = 24
// Currency constants
export const CURRENCY_CODE = {
  GC: 'GC',
  BSC: 'BSC',
  PSC: 'PSC',
  RSC: 'RSC'
}

export const REGION_ALLOWED_ROUTES = {
  SIGN_UP: '/signup',
  GOOGLE_LOGIN: '/google-signup-login',
  FACEBOOK_LOGIN: '/facebook-signup-login',
  LOGIN: '/login',
  ACCESS_ALLOW: '/accessAllowed',
  UPDATE_PROFILE: '/update',
  PHONE_VERIFICATION: '/verify-otp',
  DAILY_BONUS: '/avail-daily-bonus',
  AMOE_BONUS: '/generate-postal-code',
  PURCHASE: '/package/purchase',
  REDEEM: '/redeem',
  INIT_GAME: '/init-game'
}

// Shufti KYC status
export const SHUFTI_KYC_STATUS = {
  COMPLETED: 'verification.accepted',
  FAILED: 'verification.declined',
  IN_PROGRESS: 'review.pending'
}

export const KYC_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETE',
  FAILED: 'FAILED',
  IN_PROGRESS: 'IN_PROGRESS',
  CREATED: 'CREATED',
  ACTIVATED: 'ACTIVATED',
  PROCESSING: 'PROCESSING',
  ARCHIVED: 'ARCHIVED'
}
export const KYC_LEVELS = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4
}

export const DOCUMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ON_HOLD: 'ON_HOLD',
  RE_REQUESTED: 'RE_REQUESTED'
}
export const KYC_ACTIONS = {
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  DOCUMENT_APPROVED: 'DOCUMENT_APPROVED',
  DOCUMENT_REJECTED: 'DOCUMENT_REJECTED',
  DOCUMENT_RE_REQUESTED: 'DOCUMENT_RE_REQUESTED',
  KYC_STATUS_UPDATED: 'KYC_STATUS_UPDATED',
  KYC_LEVEL_UPDATED: 'KYC_LEVEL_UPDATED',
  KYC_VERIFIED: 'KYC_VERIFIED',
  KYC_REJECTED: 'KYC_REJECTED',
  KYC_VERIFICATION_REQUESTED: 'KYC_VERIFICATION_REQUESTED'
}
// export const DOCUMENT_TYPES = {
//   PASSPORT: 'passport',
//   NATIONAL_ID: 'national_id',
//   DRIVING_LICENSE: 'driving_license',
//   UTILITY_BILL: 'utility_bill',
//   BANK_STATEMENT: 'bank_statement',
//   SELFIE: 'selfie',
//   PROOF_OF_ADDRESS: 'proof_of_address',
//   PROOF_OF_INCOME: 'proof_of_income'
// }

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png'],
  PDF: ['application/pdf'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
}

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  PDF: 10 * 1024 * 1024, // 10MB
  MAX: 10 * 1024 * 1024 // 10MB
}

export const CURRENCY = {
  GC: 1,
  BSC: 2,
  PSC: 3,
  RSC: 4
}

export const PAGES_CATEGORY = {
  EXPLORE: 'explore',
  HOW_TO: 'how_to',
  INFORMATION: 'information',
  ABOUNT_US: 'about_us'
}

// Email template constants start
export const EMAIL_TEMPLATE_EVENT_TYPES = {
  RESET_PASSWORD: 'reset_password',
  EMAIL_VERIFICATION: 'email_verification'
}
// Email template constants end

export const TWO_FACTOR_AUTH = {
  issuer: 'Phibet',
  label: 'Phibet',
  algorithm: 'SHA1',
  digits: 6,
  period: 30
}

export const IDCOMPLY_ID_TYPES = {
  PASSPORT: 'passport',
  IDCARD: 'idCard',
  DRIVING_LICENCE: 'drivingLicense',
  RESIDENT_PERMIT: 'residencePermit'
}

export const IDCOMPLY_MATCH_TYPES = {
  FAIL: 'fail',
  FULL: 'full',
  PARTIAL: 'partial'
}

export const IDCOMPLY_USER_STATUS = {
  CREATED: 'created',
  ACTIVATED: 'activated',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  FAILED: 'failed',
  ARCHIVED: 'archived'
}

export const IDCOMPLY_ERRORS = {
  firstName: { name: 'Please enter a valid first name.', field: 'firstName' },
  lastName: { name: 'Please enter a valid last name.', field: 'lastName' },
  streetAddress: { name: 'Please enter a valid street address.', field: 'address1' },
  city: { name: 'Please enter a valid city name.', field: 'city' },
  zip: { name: 'Please enter a valid ZIP code.', field: 'zipCode' },
  state: { name: 'Please select a valid state.', field: 'stateCode' },
  dobYear: { name: 'Please enter a valid year of birth.', field: 'dateOfBirth' },
  dobMonth: { name: 'Please enter a valid month of birth.', field: 'dateOfBirth' },
  dobDay: { name: 'Please enter a valid day of birth.', field: 'dateOfBirth' },
  'zip.invalid': { name: 'Please enter a valid ZIP code.', field: 'zipCode' },
  'state.invalid': { name: 'Please select a valid state.', field: 'stateCode' },
  'city.empty': { name: 'Please select a valid city name.', field: 'city' },
  'country.empty': 'Please select a country.',
  'dob.empty': { name: 'Please select a valid date of birth.', field: 'dateOfBirth' },
  'dobYear.empty': { name: 'Please enter year of birth.', field: 'dateOfBirth' },
  'firstName.empty': { name: 'Please enter firstName', field: 'firstName' },
  'lastName.empty': { name: 'Please enter your lastName.', field: 'lastName' },
  'state.empty': { name: 'Please select an state.', field: 'stateCode' },
  'zip.empty': { name: 'Please select zip code.', field: 'zipCode' },
  'streetAddress.empty': { name: 'Street address can not be empty.', field: 'address1' },
  'dobDay.empty': { name: 'Please enter a day of birth.', field: 'dateOfBirth' },
  'dobMonth.empty': { name: 'Please enter a month of birth.', field: 'dateOfBirth' },
  'city.invalid': { name: 'Please select a valid city name.', field: 'city' },
  'country.invalid': 'Please select a valid country name.',
  'dobYear.invalid': { name: 'Please select a valid year of birth.', field: 'dateOfBirth' },
  'dobMonth.invalid': { name: 'Please select a valid month of birth.', field: 'dateOfBirth' },
  'dobDay.invalid': { name: 'Please select a valid day of birth.', field: 'dateOfBirth' },
  'firstName.invalid': { name: 'Please select valid firstName', field: 'firstName' },
  'lastName.invalid': { name: 'Please select valid lastName.', field: 'lastName' },
  'streetAddress.invalid': { name: 'Please select valid streetAddress', field: 'address1' }
}

export const IDCOMPLY_PROFILE_SEND_DATA_LIMIT = 3
