
export const getGroupChatSchema = {
  query: {
    type: 'object',
    properties: {
      searchMessage: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      chatGroupId: { type: 'string' },
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
            records: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  messageId: { type: 'number' },
                  message: { type: ['string', 'null'] },
                  actioneeId: { type: 'string' },
                  gif: { type: ['string', 'null'] },
                  messageType: { type: 'string' },
                  status: { type: 'number' },
                  isContainOffensiveWord: { type: 'boolean' },
                  createdAt: { type: 'string', format: 'date-time' },
                }
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
