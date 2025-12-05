export const createChatRainSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      prizeMoney: { type: 'number' },
      currency: { type: 'string' },
      chatGroupId: { type: 'string' },
      playersCount: { type: 'number', minimum: 1, maximum: 2000 } // we can change player count minimum and maximum as per our requirement
    },
    required: ['name', 'prizeMoney', 'currency', 'chatGroupId']
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
