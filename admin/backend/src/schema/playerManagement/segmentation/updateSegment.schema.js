export const updateSegmentSchema = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      comments: { type: 'string' },
      condition: { type: 'array' }
    },
    required: ['id', 'name', 'comments', 'condition']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
