export const createBonusSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            bonus: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                claimedCount: { type: 'number' },
                id: { type: 'string' },
                bonusType: { type: 'string' },
                validFrom: { type: 'string' },
                validTo: { type: 'string' },
                daysToClear: { type: 'number' },
                validOnDays: { type: 'number' },
                visibleInPromotions: { type: 'boolean' },
                termAndCondition: { type: 'object' },
                promotionTitle: { type: 'object' },
                description: { type: 'object' },
                isActive: { type: 'boolean' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                imageUrl: { type: 'string' },
                orderId: { type: 'number' },
                moreDetails: { type: 'object' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
