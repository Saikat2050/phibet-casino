export const getChatRainSchema = {
  query: {
    type: 'object',
    properties: {
      groupId: { type: 'number' }
    },
    required: ['groupId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            chatRainDetails: {
              type: 'object',
              properties: {
                chatGroupId: { type: 'string' },
                closedAt: { type: 'string' },
                createdAt: { type: 'string' },
                criteria: { type: 'string' },
                currencyId: { type: 'string' },
                description: { type: 'string' },
                id: { type: 'number' },
                isClosed: { type: 'boolean' },
                name: { type: 'string' },
                prizeMoney: { type: 'number' },
                updatedAt: { type: 'string' }
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
