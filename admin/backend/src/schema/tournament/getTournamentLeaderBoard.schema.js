export const getTournamentLeaderBoardSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            leaderBoard: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  tournamentId: { type: 'string' },
                  currencyId: { type: 'string' },
                  points: { type: 'number' },
                  winPoints: { type: 'number' },
                  amountSpent: { type: 'number' },
                  rebuyLimit: { type: 'number' },
                  winPrize: { type: 'number' },
                  isActive: { type: 'boolean' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                  user: { type: 'object' }
                }
              }
            },
            page: { type: 'string' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
