export const joinChatGroupSchema = {
  body: {
    type: 'object',
    properties: {
      chatGroupId: { type: ['number'] },
      userId: { type: 'number' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            groupJoined: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'boolean' },
                criteia: { type: 'array' },
                createdAt: { type: 'string' },
                isGlobal: { type: 'boolean' },
                isJoined: { type: 'boolean' }
              }
            },
            message: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
