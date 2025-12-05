export const getCasinoTransactionSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            casinoTransactions: { type: 'array' },
            totalBetAmount: { type: 'number' },
            totalWinAmount: { type: 'number' },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          },
          required: ['casinoTransactions', 'totalBetAmount', 'totalWinAmount', 'page', 'totalPages']
        },
        errors: { type: 'array' }
      }
    }
  }
}
