export const editProviderSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            provider: {
              type: 'object',
              properties: {
                casinoAggregatorId: { type: 'string' },
                id: { type: 'number' },
                name: { type: 'object' },
                uniqueId: { type: 'string' },
                isActive: { type: 'boolean' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                iconUrl: { type: 'string' },
                restrictedStates: { type: ['string', 'array', 'null'] }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
