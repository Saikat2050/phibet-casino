
export const deleteOffensiveWordsSchema = {
  query: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
