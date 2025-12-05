export const PAYMENT_TYPE = {
  PAYSAFE: 'PAYSAFE',
  PAY_BY_BANK: 'PAY_BY_BANK'
}

export const PAYMENT_PROVIDER = {
  PAYSAFE: 'PAYSAFE'
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

export const PAYMENT_PROVIDER_CATEGORY = {
  INSTANT_BANKING: 'Instant Banking',
  CREDIT_CARD: 'Credit Card',
  CRYPTO: 'Crypto',
  WALLET: 'Wallet',
  VOUCHERS: 'Vouchers',
  OTHER: 'Other'
}

export const PAYMENT_AGGREGATOR = {
  PAYSAFE: 'PAYSAFE',
  APPROVELY: 'APPROVELY'
}

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
  FLAGGED_PARTNER: 'flagged_partner',
  WITHDRAW_SUCCESS: 'Withdraw Success',
  WITHDRAW_FAILED: 'Withdraw Failure'
}

export const PAYSAFE_TRANSACTION_TYPE = {
  PAYMENT: 'PAYMENT',
  STANDALONE_CREDIT: 'STANDALONE_CREDIT'
}

export const PAYSAFE_PAYMENT_TYPE = ['neteller', 'skrill', 'paysafecard', 'paysafecash', 'instantach', 'paypal', 'card', 'vippreferred', 'sightline', 'ach', 'eft']

export const PAYSAFE_PAYMENT_HANDLE_EVENTS = [
  'PAYMENT_HANDLE_FAILED',
  'PAYMENT_HANDLE_EXPIRED',
  'PAYMENT_HANDLE_ERRORED',
  'PAYMENT_HANDLE_DELETED',
  'PAYMENT_EXPIRED',
  'PAYMENT_FAILED'
]

export const PAYSAFE_PAYMENT_EVENT = ['PAYMENT_HANDLE_PAYABLE', 'PAYMENT_COMPLETED']

export const PAYSAFE_PAYMENT_STATUS = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PENDING: '0',
  INITIATED: 'INITIATED',
  PAYABLE: 'PAYABLE'
}
