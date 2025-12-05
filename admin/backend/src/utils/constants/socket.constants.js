export const NAMESPACES = {
  PUBLIC: '/public',
  PRIVATE: '/private',
  INTERNAL: '/internal',
  USER_CHAT: '/user-chat',
  JACKPOT_ADMIN: '/jackpot-admin'
}

export const ROOMS = {
  PRIVATE: {
    BET: 'bet',
    WALLET: 'wallet',
    DISPUTE: 'dispute',
    EXCHANGE_BET: 'exchange_bet',
    NOTIFICATION: 'notification',
    LOGOUT: 'logout',
    JACKPOT: 'JACKPOT'
  },
  PUBLIC: {
    IN_PLAY: 'in-play',
    PRE_MATCH: 'pre-match',
    ORDER_BOOK: 'order-book',
    NOTIFICATION: 'notification',
    USER_CHAT: NAMESPACES.USER_CHAT + '/chat'
  },
  INTERNAL: {
    CASINO_TRANSACTION: 'casino-transaction'
  }
}

export const EVENTS = {
  BET: 'bet',
  WALLET: 'wallet',
  DISPUTE: 'dispute',
  EXCHANGE_BET: 'exchange_bet',
  LOGOUT: 'logout'
}

export const SOCKET_EMITTERS = {
  LIVE_USERS_CHATS: NAMESPACES.USER_CHAT + '/liveUserChat',
  LIVE_CHAT_RAIN: NAMESPACES.USER_CHAT + '/liveChatRain',
  CLOSED_CHAT_RAIN: NAMESPACES.USER_CHAT + '/closedChatRain',
  JACKPOT_ADMIN_UPDATE: 'JACKPOT_ADMIN_UPDATE'
}

export const SOCKET_LISTENERS = {
  DEMO_HELLO_WORLD: NAMESPACES.DEMO + '/helloWorld',
  SEND_MESSAGE: NAMESPACES.USER_CHAT + '/send-message'
}
