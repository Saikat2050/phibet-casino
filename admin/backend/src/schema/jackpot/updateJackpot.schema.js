export const updateJackpotSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        jackpotId: { type: 'number' },
        jackpotName: { type: 'string' },
        maxTicketSize: { type: 'number' },
        seedAmount: { type: 'number' },
        entryAmount: { type: 'number' },
        adminShare: { type: 'number' },
        poolShare: { type: 'number' },
        winningTicket: { type: 'number' }
      },
      required: ['jackpotId']
    },
    errors: { type: 'array' }
  }

}
