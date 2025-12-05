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
    uniqueId: '2',
    name: 'iconic21'
  }
}

/**
 * @type {Object.<string, { id: string, name: string, subCategories: { id: string, name: string }[] }[]>}
 */
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
// {
//   id: 6,
//   name: 'SportBook'
// },
{
  id: 7,
  name: 'video-poker'
},
// {
//   id: 8,
//   name: 'SportBook'
// },
{
  id: 9,
  name: 'video-slot'
}, {
  id: 10,
  name: 'scratch-card'
}, {
  id: 11,
  name: 'crash'
}, {
  id: 12,
  name: 'Scratchcards'
}, {
  id: 13,
  name: 'probability'
}, {
  id: 14,
  name: 'keno'
},
{
  id: 15,
  name: 'Roulette'
}
]
