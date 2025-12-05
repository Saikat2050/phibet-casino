export const getTournamentTransactionSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            tournamentTransactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  transactionId: { type: 'string' },
                  userId: { type: 'string' },
                  tournamentId: { type: 'string' },
                  casinoGameId: { type: 'string' },
                  type: { type: 'string' },
                  purpose: { type: 'string' },
                  points: { type: 'number' },
                  isActive: { type: 'boolean' },
                  createdAt: { type: 'string' },
                  casinoGame: { type: 'object' },
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
