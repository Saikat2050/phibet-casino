export const getSegmentsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            totalPages: { type: 'number' },
            segments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  comments: { type: 'string' },
                  condition: { type: 'array' }
                },
                required: ['id', 'name', 'comments', 'condition']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
