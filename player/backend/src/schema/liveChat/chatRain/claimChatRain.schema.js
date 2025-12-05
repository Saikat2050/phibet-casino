export const claimChatRainSchema = {
  body: {
    type: 'object',
    properties: {
      groupId: { type: 'number' },
      chatRainId: { type: 'number' }
    },
    required: ['groupId', 'chatRainId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            claimData: {
              $ref: '#/definitions/chatRainUser'
            },
            message: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
