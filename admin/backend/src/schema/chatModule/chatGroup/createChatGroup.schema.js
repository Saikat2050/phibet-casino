
export const createChatGroupSchema = {
  body: {
    type: 'object',
    properties: {
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
    required: ['name', 'status', 'description']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            group: { $ref: '#/definitions/chatGroup' },
            message: { type: 'string' },
            check: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
