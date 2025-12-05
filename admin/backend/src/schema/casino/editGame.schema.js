export const editGameSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            game: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                uniqueId: { type: 'string' },
                name: { type: 'object' },
                casinoCategoryId: { type: 'string' },
                casinoProviderId: { type: 'string' },
                returnToPlayer: { type: 'number' },
                wageringContribution: { type: 'number' },
                desktopImageUrl: { type: 'string' },
                mobileImageUrl: { type: 'string' },
                orderId: { type: 'number' },
                volatilityRating: { type: ['string', 'null'] },
                devices: {
                  oneOf: [
                    { type: 'string' },
                    {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  ]
                },
                demoAvailable: { type: 'boolean' },
                restrictedStates: {
                  type: 'array',
                  items: { type: 'string' }
                },
                isFeatured: { type: 'boolean' },
                moreDetails: { type: ['object', 'null'] },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        errors: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }
  }
}
