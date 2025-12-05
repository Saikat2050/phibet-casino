export const emitChatRainSchema = {
  body: {
    type: 'object',
    properties: {
      chatRainId: { type: 'number' }
    },
    required: ['chatRainId']
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
