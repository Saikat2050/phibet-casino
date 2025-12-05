export const getGameReportSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            gameReport: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  totalBetAmount: { type: 'number' },
                  totalWinAmount: { type: 'number' },
                  totalPlayers: { type: 'string' },
                  id: { type: 'string' },
                  name: { type: 'string' },
                  gameRevenue: { type: 'number' },
                  payout: { type: 'number' }
                },
                required: ['id', 'totalBetAmount', 'totalWinAmount', 'totalPlayers', 'name', 'gameRevenue', 'payout']
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' },
            totalBetAmount: { type: 'number' },
            totalWinAmount: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
