export const issueBonusSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            userBonus: {
              type: 'object',
              properties: {
                wageredAmount: { type: 'number' },
                id: { type: 'string' },
                bonusId: { type: 'string' },
                userId: { type: 'string' },
                issuerId: { type: 'number' },
                currencyId: { type: 'string' },
                status: { type: 'string' },
                expireAt: { type: 'string' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                transactionId: { type: 'string' },
                amountToWager: { type: 'number' },
                claimedAt: { type: 'string' },
                cancelledBy: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
