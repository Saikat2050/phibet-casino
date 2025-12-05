export const selfExclusionSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            userLimit: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                type: { type: 'string' },
                key: { type: 'string' },
                value: { type: 'string' },
                currentValue: { type: 'string' },
                expireAt: { type: 'string' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
