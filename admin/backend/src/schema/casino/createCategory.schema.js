export const createCategorySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            category: {
              type: 'object',
              properties: {
                isDefault: { type: 'boolean' },
                id: { type: 'number' },
                name: { type: 'object' },
                uniqueId: { type: 'string' },
                isActive: { type: ['boolean', 'string'] },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                iconUrl: { type: 'string' },
                orderId: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
