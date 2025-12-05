export const createTagSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            tag: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                tag: { type: 'string' },
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
