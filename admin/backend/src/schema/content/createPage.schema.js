export const createPageSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            page: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                title: { type: 'object' },
                content: { type: 'object' },
                isActive: { type: 'boolean' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' },
                slug: { type: 'string' },
                category: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
