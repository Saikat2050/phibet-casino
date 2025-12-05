export const getPageSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            pages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'object' },
                  content: { type: 'object' },
                  isActive: { type: 'boolean' },
                  slug: { type: 'string' }
                },
                required: ['id', 'title', 'content', 'isActive', 'slug']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
