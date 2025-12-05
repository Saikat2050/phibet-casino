export const updateChatGroupSchema = {
  body: {
    type: 'object',
    properties: {
      chatGroupId: {type: 'number'},
      name: { type: ['string', 'null'], transform: ['trim', 'toLowerCase'] },
      description: { type: ['string', 'null'] },
      status: { type: 'boolean' },
      criteria: {
        type: 'array',
        items: {
          type: 'object'
        }
      },
      isGlobal: {
        type: 'boolean'
      }
    },
    required: ['chatGroupId']
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
