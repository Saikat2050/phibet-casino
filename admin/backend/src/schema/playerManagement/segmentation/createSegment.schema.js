export const createSegmentSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      comments: { type: 'string' },
      condition: { type: 'array' }
    },
    required: ['name', 'comments', 'condition']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            segmentDetail: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                comments: { type: 'string' },
                condition: { type: 'array' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
