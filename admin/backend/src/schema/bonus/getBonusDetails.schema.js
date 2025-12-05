export const getBonusDetailsSchema = {
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
                percentage: { type: 'string' },
                validFrom: { type: 'string' },
                validTo: { type: 'string' },
                daysToClear: { type: 'number' },
                validOnDays: { type: 'number' },
                visibleInPromotions: { type: 'boolean' },
                termAndCondition: { type: 'object' },
                promotionTitle: { type: 'object' },
                description: { type: 'object' },
                isActive: { type: 'boolean' },
                imageUrl: { type: 'string' },
                orderId: { type: 'number' },
                bonusCurrencies: { type: 'array' },
                freespinBonus: { type: 'object' },
                depositBonus: { type: 'object' }
              }
            },
            tags: { type: 'array' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
