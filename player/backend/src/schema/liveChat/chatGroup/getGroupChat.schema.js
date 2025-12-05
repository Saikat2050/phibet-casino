export const getGroupChatSchema = {
  query: {
    type: 'object',
    properties: {
      searchMessage: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      chatGroupId: { type: 'number' },
      fromDate: { type: 'string', format: 'date' },
      toDate: { type: 'string', format: 'date' },
      userId: { type: 'string' }
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
            chatDetails: {
              type: 'array',
              // items: { $ref: '#/definitions/message' }
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
