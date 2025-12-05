export const CASINO_ENTITY_TYPES = {
  GAME: 'game',
  CATEGORY: 'category',
  PROVIDER: 'provider',
  AGGREGATOR: 'aggregator',
  SUB_CATEGORY: 'sub_category'
}

// CasinoTransaction constants start
export const CASINO_TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
}

export const AGGREGATORS = {
  ALEA: {
    id: '1',
    name: 'alea'
  },
  ICONIC21: {
    id: '2',
    name: 'iconic21',
    provider: 'ICONIC 21',
    providerId: 'ICONIC_21'
  }
}

export const DEFAULT_CATEGORIES = [{
  id: 1,
  name: 'Live'
}, {
  id: 2,
  name: 'Slots'
}, {
  id: 3,
  name: 'Virtuals'
}, {
  id: 4,
  name: 'TvGames'
}, {
  id: 5,
  name: 'Poker'
},
{
  id: 6,
  name: 'video-poker'
},
{
  id: 7,
  name: 'video-slot'
}, {
  id: 8,
  name: 'scratch-card'
}, {
  id: 9,
  name: 'crash'
}, {
  id: 10,
  name: 'Scratchcards'
}, {
  id: 11,
  name: 'probability'
}, {
  id: 12,
  name: 'keno'
},
{
  id: 13,
  name: 'Roulette'
}
]
