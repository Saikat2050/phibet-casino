export const jackpotRnGSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        maxTicketSize: { type: 'string' },
        seedAmount: { type: 'string' },
        entryAmount: { type: 'string' },
        adminShare: { type: 'string' },
        poolShare: { type: 'string' }
      },
      required: ['maxTicketSize', 'seedAmount', 'entryAmount', 'adminShare', 'poolShare']
    },
    errors: { type: 'array' }
  }

}
