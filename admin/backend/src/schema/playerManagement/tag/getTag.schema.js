export const getTagsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  isActive: { type: 'boolean' },
                  id: { type: 'string' },
                  tag: { type: 'string' },
                  updatedAt: { type: 'string' },
                  createdAt: { type: 'string' }
                }
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
