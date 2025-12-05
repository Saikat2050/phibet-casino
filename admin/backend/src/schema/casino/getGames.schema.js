export const getGamesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            games: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  uniqueId: { type: 'string' },
                  name: { type: 'object' },
                  casinoCategoryId: { type: 'string' },
                  casinoProviderId: { type: 'string' },
                  returnToPlayer: { type: 'number' },
                  wageringContribution: { type: 'number' },
                  mobileImageUrl: { type: 'string' },
                  desktopImageUrl: { type: 'string' },
                  thumbnailUrl: { type: 'object' },
                  orderId: { type: 'string' },
                  volatilityRating: { type: 'string' },
                  devices: { type: ['array', 'string'] },
                  demoAvailable: { type: 'boolean' },
                  restrictedStates: { type: ['string', 'array'] },
                  isFeatured: { type: 'boolean' },
                  landingPage: { type: 'boolean' },
                  isActive: { type: 'boolean' },
                  casinoProvider: { type: 'object' },
                  moreDetails: { type: ['object', 'null'] },
                  casinoGameCategories: { type: 'array' }
                }
              }
            },
            totalPages: { type: 'number' },
            page: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
