
const PERMISSION_LEVELS_INVERTED = {
  R: 'read',
  C: 'create',
  U: 'update',
  D: 'delete',
  I: 'issue',
  L: 'limit',
  TS: 'toggle_status',
  VE: 'verify_email',
  MM: 'manage_money',
  RP: 'reset_password'
}

/**
 * Binds resource to permission levels.
 * @param {string} resource - The resource name.
 * @param {Array<string>} permissions - Array of permission levels.
 * @returns {PERMISSION_LEVELS} - Object mapping permission levels to resource-specific keys.
 */
function bindLevels (resource, permissions = Object.keys(PERMISSION_LEVELS)) {
  return permissions.reduce((prev, level) => {
    prev[PERMISSION_LEVELS_INVERTED[level]] = `${resource}:${level}`
    return prev
  }, {})
}

const PERMISSION_LEVELS = {
  read: 'R',
  create: 'C',
  update: 'U',
  delete: 'D',
  issue: 'I',
  limit: 'L',
  toggle_status: 'TS',
  verify_email: 'VE',
  verify_phone: 'VP',
  manage_money: 'MM',
  reset_password: 'RP',
  verify_kyc: 'VK'
}

export const APPLICATION_PERMISSION = {
  page: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete],
  admin: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete],
  bonus: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status],
  vip: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.create],
  banner: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.delete],
  gallery: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  player: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.verify_email, PERMISSION_LEVELS.verify_phone, PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.manage_money, PERMISSION_LEVELS.verify_kyc],
  comment: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  gameReport: [PERMISSION_LEVELS.read],
  casinoManagement: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  applicationSetting: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.toggle_status],
  referral: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update],
  package: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.create],
  segmentation: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.create, PERMISSION_LEVELS.issue],
  amoe: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update],
  redeem: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.update],
  reportLedger: [PERMISSION_LEVELS.read],
  reportTransaction: [PERMISSION_LEVELS.read],
  reportCasinoTransaction: [PERMISSION_LEVELS.read],
  reportPlayerPerformance: [PERMISSION_LEVELS.read],
  paymentManagement: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update],
  state: [PERMISSION_LEVELS.toggle_status, PERMISSION_LEVELS.read],
  spinWheelConfiguration: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.toggle_status],
  seoPage: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  emailTemplate: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  bonusReport: [PERMISSION_LEVELS.read],
  testimonial: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  kyc: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete, PERMISSION_LEVELS.verify_kyc],
  jackpot: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete],
  chat: [PERMISSION_LEVELS.read, PERMISSION_LEVELS.create, PERMISSION_LEVELS.update, PERMISSION_LEVELS.delete]
}

/** @type {APPLICATION_PERMISSION} */
export const resources = Object.keys(APPLICATION_PERMISSION).reduce((prev, key) => {
  prev[key] = bindLevels(key, APPLICATION_PERMISSION[key])
  return prev
}, {})
