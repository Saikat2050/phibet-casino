export const SQL_OPERATORS = {
  eq: '=',
  ne: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  like: 'LIKE',
  notLike: 'NOT LIKE',
  in: 'IN',
  notIn: 'NOT IN',
  between: 'BETWEEN',
  notBetween: 'NOT BETWEEN',
  exists: 'EXISTS',
  notExists: 'NOT EXISTS',
  isNull: 'IS NULL',
  isNotNull: 'IS NOT NULL'
}

export const OPERATORS = {
  eq: 'eq',
  ne: 'ne',
  lt: 'lt',
  lte: 'lte',
  gt: 'gt',
  gte: 'gte',
  in: 'in',
  notIn: 'notIn',
  between: 'between',
  notBetween: 'notBetween',
  exists: 'exists',
  notExists: 'notExists',
  isNull: 'isNull',
  isNotNull: 'isNotNull',
  like: 'like',
  notLike: 'notLike'
}

const columns = {
  users: {
    id: { name: 'id', type: 'BIGINT' },
    username: { name: 'username', type: 'STRING' },
    firstName: { name: 'first_name', type: 'STRING' },
    lastName: { name: 'last_name', type: 'STRING' },
    email: { name: 'email', type: 'STRING' },
    emailVerified: { name: 'email_verified', type: 'BOOLEAN' },
    phoneCode: { name: 'phone_code', type: 'STRING' },
    phone: { name: 'phone', type: 'STRING' },
    phoneVerified: { name: 'phone_verified', type: 'BOOLEAN' },
    languageId: { name: 'language_id', type: 'BIGINT' },
    dateOfBirth: { name: 'date_of_birth', type: 'DATE' },
    gender: { name: 'gender', type: 'ENUM' },
    password: { name: 'password', type: 'STRING' },
    loggedIn: { name: 'logged_in', type: 'BOOLEAN' },
    lastLoggedInIp: { name: 'last_logged_in_ip', type: 'STRING' },
    loggedInAt: { name: 'logged_in_at', type: 'DATE' },
    imageUrl: { name: 'image_url', type: 'STRING' },
    kycStatus: { name: 'kyc_status', type: 'STRING' },
    loyaltyPoints: { name: 'loyalty_points', type: 'FLOAT' },
    isActive: { name: 'is_active', type: 'BOOLEAN' },
    countryId: { name: 'country_id', type: 'BIGINT' },
    sessionLimit: { name: 'session_limit', type: 'INTEGER' },
    publicAddress: { name: 'public_address', type: 'STRING' },
    nonce: { name: 'nonce', type: 'STRING' },
    referredBy: { name: 'referred_by', type: 'BIGINT' },
    chatSettings: { name: 'chat_settings', type: 'JSONB' },
    createdAt: { name: 'created_at', type: 'DATE' },
    updatedAt: { name: 'updated_at', type: 'DATE' }
  },
  ledgers: {
    id: { name: 'id', type: 'BIGINT' },
    amount: { name: 'l.amount', type: 'DOUBLE' },
    bonusAmount: { name: 'bonus_amount', type: 'DOUBLE' },
    purpose: { name: 'purpose', type: 'ENUM' },
    currencyId: { name: 'currency_id', type: 'BIGINT' },
    toWalletId: { name: 'to_wallet_id', type: 'BIGINT' },
    fromWalletId: { name: 'from_wallet_id', type: 'BIGINT' },
    createdAt: { name: 'created_at', type: 'DATE' },
    updatedAt: { name: 'updated_at', type: 'DATE' }
  },
  withdrawals: {
    id: { name: 'id', type: 'BIGINT' },
    userId: { name: 'user_id', type: 'BIGINT' },
    ledgerId: { name: 'ledger_id', type: 'BIGINT' },
    status: { name: 'status', type: 'ENUM' },
    type: { name: 'type', type: 'ENUM' },
    amount: { name: 'amount', type: 'DOUBLE' },
    transactionId: { name: 'transaction_id', type: 'STRING' },
    approvedAt: { name: 'approved_at', type: 'DATE' },
    confirmedAt: { name: 'confirmed_at', type: 'DATE' },
    comment: { name: 'comment', type: 'STRING' },
    createdAt: { name: 'created_at', type: 'DATE' },
    updatedAt: { name: 'updated_at', type: 'DATE' }
  },
  wallets: {
    id: { name: 'id', type: 'BIGINT' },
    currencyId: { name: 'currency_id', type: 'BIGINT' },
    userId: { name: 'user_id', type: 'BIGINT' },
    amount: { name: 'amount', type: 'DOUBLE' },
    bonusAmount: { name: 'bonus_amount', type: 'DOUBLE' },
    isDefault: { name: 'is_default', type: 'BOOLEAN' },
    createdAt: { name: 'created_at', type: 'DATE' },
    updatedAt: { name: 'updated_at', type: 'DATE' }
  },
  transactions: {
    id: { name: 'id', type: 'BIGINT' },
    ledgerId: { name: 'ledger_id', type: 'BIGINT' },
    userId: { name: 'user_id', type: 'BIGINT' },
    status: { name: 'status', type: 'ENUM' },
    paymentId: { name: 'payment_id', type: 'STRING' },
    paymentProviderId: { name: 'payment_provider_id', type: 'STRING' },
    actioneeId: { name: 'actionee_id', type: 'BIGINT' },
    moreDetails: { name: 'more_details', type: 'JSONB' },
    createdAt: { name: 'created_at', type: 'DATE' },
    updatedAt: { name: 'updated_at', type: 'DATE' }
  },

  casino_transactions: {
    id: { name: 'id', type: 'BIGINT' },
    transactionId: { name: 'transaction_id', type: 'STRING' },
    userId: { name: 'user_id', type: 'INTEGER' },
    gameId: { name: 'game_id', type: 'BIGINT' },
    ledgerId: { name: 'ledger_id', type: 'BIGINT' },
    status: { name: 'status', type: 'ENUM' },
    previousTransactionId: { name: 'previous_transaction_id', type: 'STRING' },
    createdAt: { name: 'created_at', type: 'DATE' },
    updatedAt: { name: 'updated_at', type: 'DATE' }
  }
}
export const SEGMENT_DESCRIPTIONS = {
  withdrawAmount: {
    eq: 'Users who withdrew exactly value.',
    ne: 'Users who withdrew an amount different from value.',
    gt: 'Users who withdrew more than value.',
    gte: 'Users who withdrew at least value.',
    lt: 'Users who withdrew less than value.',
    lte: 'Users who withdrew at most value.',
    between: 'Users who withdrew between value1 and value2.',
    notBetween: 'Users who did not withdraw between value1 and value2.'
  },

  depositAmount: {
    eq: 'Users who deposited exactly value.',
    ne: 'Users who deposited an amount different from value.',
    gt: 'Users who deposited more than value.',
    gte: 'Users who deposited at least value.',
    lt: 'Users who deposited less than value.',
    lte: 'Users who deposited at most value.',
    between: 'Users who deposited between value1 and value2.',
    notBetween: 'Users who did not deposit between value1 and value2.'
  },

  wageringAmount: {
    eq: 'Users who wagered exactly value.',
    ne: 'Users who wagered an amount different from value.',
    gt: 'Users who wagered more than value.',
    gte: 'Users who wagered at least value.',
    lt: 'Users who wagered less than value.',
    lte: 'Users who wagered at most value.',
    between: 'Users who wagered between value1 and value2.',
    notBetween: 'Users who did not wager between value1 and value2.'
  },

  wageringCount: {
    eq: 'Users who placed exactly value bets.',
    ne: 'Users who placed a different number of bets than value.',
    gt: 'Users who placed more than value bets.',
    gte: 'Users who placed at least value bets.',
    lt: 'Users who placed less than value bets.',
    lte: 'Users who placed at most value bets.',
    between: 'Users who placed between value1 and value2 bets.',
    notBetween: 'Users who did not place between value1 and value2 bets.'
  },

  playersStatus: {
    eq: 'Users with status value.',
    ne: 'Users without status value.'
  },

  signup: {
    eq: 'Users who signed up on value.',
    ne: 'Users who did not sign up on value.',
    gt: 'Users who signed up after value.',
    gte: 'Users who signed up on or after value.',
    lt: 'Users who signed up before value.',
    lte: 'Users who signed up on or before value.',
    between: 'Users who signed up between value2 and value1.',
    notBetween: 'Users who did not sign up between value2 and value1.'
  },

  age: {
    eq: 'Users exactly value years old.',
    ne: 'Users not value years old.',
    gt: 'Users older than value.',
    gte: 'Users value years or older.',
    lt: 'Users younger than value.',
    lte: 'Users value years or younger.',
    between: 'Users between value1 and value2 years old.',
    notBetween: 'Users not between value1 and value2 years old.'
  },

  gender: {
    eq: 'Users who are value.',
    ne: 'Users who are not value.'
  },

  grossGamingRevenue: {
    eq: 'Users with a total gross gaming revenue of value.',
    ne: 'Users with a total gross gaming revenue different from value.',
    gt: 'Users with a total gross gaming revenue greater than value.',
    gte: 'Users with a total gross gaming revenue of at least value.',
    lt: 'Users with a total gross gaming revenue less than value.',
    lte: 'Users with a total gross gaming revenue of at most value.',
    between: 'Users with a total gross gaming revenue between value1 and value2.',
    notBetween: 'Users with a total gross gaming revenue not between value1 and value2.'
  },

  winAmount: {
    eq: 'Users who won exactly value.',
    ne: 'Users who won a different amount than value.',
    gt: 'Users who won more than value.',
    gte: 'Users who won at least value.',
    lt: 'Users who won less than value.',
    lte: 'Users who won at most value.',
    between: 'Users who won between value1 and value2.',
    notBetween: 'Users who did not win between value1 and value2.'
  },

  withdrawCount: {
    eq: 'Users who made exactly value withdrawals.',
    ne: 'Users who made a different number of withdrawals than value.',
    gt: 'Users who made more than value withdrawals.',
    gte: 'Users who made at least value withdrawals.',
    lt: 'Users who made less than value withdrawals.',
    lte: 'Users who made at most value withdrawals.',
    between: 'Users who made between value1 and value2 withdrawals.',
    notBetween: 'Users who did not make between value1 and value2 withdrawals.'
  },

  depositCount: {
    eq: 'Users who made exactly value deposits.',
    ne: 'Users who made a different number of deposits than value.',
    gt: 'Users who made more than value deposits.',
    gte: 'Users who made at least value deposits.',
    lt: 'Users who made less than value deposits.',
    lte: 'Users who made at most value deposits.',
    between: 'Users who made between value1 and value2 deposits.',
    notBetween: 'Users who did not make between value1 and value2 deposits.'
  },

  lastLogin: {
    eq: 'Users who logged in on value.',
    ne: 'Users who did not log in on value.',
    gt: 'Users who logged in after value.',
    gte: 'Users who logged in on or after value.',
    lt: 'Users who logged in before value.',
    lte: 'Users who logged in on or before value.',
    between: 'Users who logged in between value2 and value1.',
    notBetween: 'Users who did not log in between value2 and value1.'
  },

  lastPlayed: {
    eq: 'Users who played on value.',
    ne: 'Users who did not play on value.',
    gt: 'Users who played after value.',
    gte: 'Users who played on or after value.',
    lt: 'Users who played before value.',
    lte: 'Users who played on or before value.',
    between: 'Users who played between value2 and value1.',
    notBetween: 'Users who did not play between value2 and value1.'
  },

  kycStatus: {
    eq: 'Users with KYC status value.',
    ne: 'Users without KYC status value.'
  }
}

export const SEGMENT_CATEGORIES = {
  withdrawAmount: { value: 'INT', table: 'ledgers', filterColumn: 'amount', queryType: 'aggregate', purpose: 'Redeem', lType: 'debit', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.withdrawAmount },

  depositAmount: { value: 'INT', table: 'ledgers', filterColumn: 'amount', queryType: 'aggregate', purpose: 'Purchase', lType: 'credit', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.depositAmount },

  wageringAmount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'CasinoBet', lType: 'wager', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.wageringAmount },

  wageringCount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'CasinoBet', lType: 'wagering_count', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.wageringCount },

  playersStatus: { value: 'BOOLEAN', table: 'users', filterColumn: 'users.is_active', queryType: 'single', lType: 'player_status', operators: ['eq', 'ne'], description: SEGMENT_DESCRIPTIONS.playersStatus },

  signup: { value: 'DATE', table: 'users', filterColumn: 'users.created_at', queryType: 'aggregate', lType: 'signup', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.signup },

  age: { value: 'INT', table: 'users', filterColumn: 'users.date_of_birth', queryType: 'single', lType: 'age', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.age },

  gender: { value: 'STRING', table: 'users', filterColumn: 'users.gender', queryType: 'single', operators: ['eq', 'ne'], description: SEGMENT_DESCRIPTIONS.gender },

  grossGamingRevenue: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', lType: 'gross_gaming_revenue', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.grossGamingRevenue },

  winAmount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'CasinoWin', lType: 'winning_amount', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.winAmount },

  withdrawCount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'Withdraw', lType: 'withdraw_count', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.withdrawCount },

  depositCount: { value: 'INT', table: 'ledgers', filterColumn: 'ledgers.amount', queryType: 'aggregate', purpose: 'Deposit', lType: 'deposit_count', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.depositCount },

  lastLogin: { value: 'DATE', table: 'users', filterColumn: 'users.logged_in_at', queryType: 'aggregate', lType: 'last_login', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.lastLogin },

  lastPlayed: { value: 'DATE', table: 'ledgers', filterColumn: 'ledgers.created_at', queryType: 'aggregate', purpose: 'CasinoBet', lType: 'last_played', operators: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'notBetween'], description: SEGMENT_DESCRIPTIONS.lastPlayed },

  // country: { value: 'INT', table: 'users', filterColumn: 'users.country_id', queryType: 'single', lType: 'country', operators: ['eq', 'ne'] },

  kycStatus: { value: 'STRING', table: 'users', filterColumn: 'users.kyc_status', queryType: 'single', lType: 'kyc_status', operators: ['eq', 'ne'], description: SEGMENT_DESCRIPTIONS.kycStatus }
}

export const SEGMENTS_QUERY = {
  withdrawAmount: `SELECT
          l.purpose,
          l.created_at,
          l.to_wallet_id,
          l.from_wallet_id,
          l.currency_id,
          l.amount,
          SUM(l.amount) FILTER (WHERE cu.code = 'USD') AS USDAmount,
          CASE
          WHEN l.to_wallet_id IS NOT NULL AND l.from_wallet_id IS NULL THEN 'debit'
          ELSE NULL
          END AS type
          FROM
          ledgers AS l
          INNER JOIN
          currencies AS cu ON l.currency_id = cu.id
          WHERE
          :where
          GROUP BY
         l.amount, l.purpose, l.created_at, l.to_wallet_id, l.from_wallet_id,
          l.currency_id`,
  depositAmount: `SELECT
          l.purpose,
          l.created_at,
          l.to_wallet_id,
          l.from_wallet_id,
          l.currency_id,
          l.amount,
          SUM(l.amount) FILTER (WHERE cu.code = 'USD') AS USDAmount,
          CASE
          WHEN l.to_wallet_id IS NULL AND l.from_wallet_id IS NOT NULL THEN 'credit'
          ELSE NULL
          END AS type
          FROM
          ledgers AS l
          INNER JOIN
          currencies AS cu ON l.currency_id = cu.id
          WHERE
          :where
          GROUP BY
          l.amount, l.purpose, l.created_at, l.to_wallet_id, l.from_wallet_id,
          l.currency_id`,
  activeUsers: 'SELECT * FROM users :where'

}

export function getQueryString (value1, value2, condition) {
  let queryString = ''
  switch (condition) {
    case OPERATORS.gt:
      queryString = `${SQL_OPERATORS.gt} ${value1}`
      break
    case OPERATORS.gte:
      queryString = `${SQL_OPERATORS.gte} ${value1}`
      break
    case OPERATORS.lt:
      queryString = `${SQL_OPERATORS.lt} ${value1}`
      break
    case OPERATORS.lte:
      queryString = `${SQL_OPERATORS.lte} ${value1}`
      break
    case OPERATORS.eq:
      queryString = `${SQL_OPERATORS.eq} ${value1}`
      break
    case OPERATORS.ne:
      queryString = `${SQL_OPERATORS.ne} ${value1}`
      break
    case OPERATORS.like:
      queryString = `${SQL_OPERATORS.like} '%${value1}%'`
      break
    case OPERATORS.notLike:
      queryString = `${SQL_OPERATORS.notLike} '%${value1}%'`
      break
    case OPERATORS.in:
      queryString = `${SQL_OPERATORS.in} (${value1})`
      break
    case OPERATORS.between:
      queryString = `${SQL_OPERATORS.between} ${value1} AND ${value2}`
      break
    case OPERATORS.notBetween:
      queryString = `${SQL_OPERATORS.notBetween} ${value1} AND ${value2}`
      break
    case OPERATORS.isNull:
      queryString = `${SQL_OPERATORS.isNull} ${value1}`
      break
    case OPERATORS.isNotNull:
      queryString = `${SQL_OPERATORS.isNotNull} ${value1}`
      break
    case OPERATORS.exists:
      queryString = `${SQL_OPERATORS.exists} (${value1})`
      break
    case OPERATORS.notExists:
      queryString = `${SQL_OPERATORS.notExists} (${value1})`
      break
    case OPERATORS.notIn:
      queryString = `${SQL_OPERATORS.notIn} (${value1})`
      break
    default:
      return queryString
  }
  return queryString
}

export function createQuery (condition) {
  try {
    let query = ''
    for (const row of condition) {
      let orQuery = ''
      for (const column in row) {
        orQuery += `${SEGMENTS_QUERY[column]}`
        const tableName = SEGMENT_CATEGORIES[column]?.table
        const segmentFilterColumn = SEGMENT_CATEGORIES[column]?.filterColumn
        const conditionColumn = columns[tableName][segmentFilterColumn]?.name
        const queryString = conditionColumn && `${conditionColumn} ${getQueryString(row[column]?.value1, row[column]?.value2, row[column]?.op)}`
        orQuery = orQuery.replace(':where', queryString)
      }
      query += orQuery
    }
    return query
  } catch (error) {
    return error
  }
}

/**
 * Formats a given value based on the provided data type.
 *
 * Supported data types:
 *  - 'INT': Returns the value as a number (as a string for query embedding).
 *  - 'STRING': Escapes and wraps the value in single quotes.
 *  - 'BOOLEAN': Returns the SQL literal true or false.
 *  - 'DATE': Converts the value to an ISO string and wraps it in single quotes.
 *
 * @param {*} value - The value to format.
 * @param {string} dataType - The data type ('INT', 'STRING', 'BOOLEAN', 'DATE').
 * @returns {string} - The formatted value ready for insertion into an SQL query.
 * @throws {Error} - If an unsupported data type is provided or if a date is invalid.
 */
export function formatSQLValue (value, dataType) {
  switch (dataType) {
    case 'INT':
      return String(Number(value))

    case 'STRING':
      return `'${String(value).replace(/'/g, "''")}'`

    case 'BOOLEAN':
      return value ? 'true' : 'false'

    case 'DATE': {
      const dateObj = new Date(value)
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date: ${value}`)
      }
      return `'${dateObj.toISOString()}'`
    }

    default:
      return value
  }
}
