export const getPagesSchema = {
  query: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            pages: {
              type: 'array',
              items: { $ref: '#/definitions/page' }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
