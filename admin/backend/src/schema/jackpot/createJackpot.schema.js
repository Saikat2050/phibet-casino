export const createJackpotSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        jackpotName: { type: 'string' },
        maxTicketSize: { type: 'number' },
        seedAmount: { type: 'number' },
        entryAmount: { type: 'number' },
        adminShare: { type: 'number' },
        poolShare: { type: 'number' }
      },
      required: [
        'jackpotName',
        'maxTicketSize',
        'seedAmount',
        'entryAmount',
        'adminShare',
        'poolShare'
      ]
    },
    errors: { type: 'array' }
  }

}
