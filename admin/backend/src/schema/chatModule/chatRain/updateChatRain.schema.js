export const updateChatRainSchema = {
  body: {
    type: 'object',
    properties: {
      chatRainId: {type: 'number'},
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      prizeMoney: { type: 'number' },
      currency: { type: 'string' },
      chatGroupId: { type: 'number' }
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
            message: { type: 'string' },
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
