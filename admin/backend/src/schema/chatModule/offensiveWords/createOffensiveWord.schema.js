
export const createOffensiveWordSchema = {
  body: {
    type: 'object',
    properties: {
      word: { type: 'string' }
    },
    required: ['word']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            word: { type: 'string' },
            message: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
