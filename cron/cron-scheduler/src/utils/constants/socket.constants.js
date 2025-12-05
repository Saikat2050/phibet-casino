export const NAMESPACES = {
  PUBLIC: '/public',
  PRIVATE: '/private',
  INTERNAL: '/internal',
  JACKPOT_USER: '/jackpot-user',
  JACKPOT_ADMIN: '/jackpot-admin'
}

export const ROOMS = {
  PRIVATE: {
    BET: 'bet',
    WALLET: 'wallet',
    EXCHANGE_BET: 'exchange_bet'
  },
  PUBLIC: {
    IN_PLAY: 'in-play',
    PRE_MATCH: 'pre-match',
    ORDER_BOOK: 'order-book',
    JACKPOT: 'jackpot',
    JACKPOT_USER: 'jackpot-user',
    JACKPOT_ADMIN: 'jackpot_admin'
  },
  INTERNAL: {
    CASINO_TRANSACTION: 'casino-transaction'
  }
}
