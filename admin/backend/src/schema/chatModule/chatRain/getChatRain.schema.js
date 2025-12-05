
export const getChatRainSchema = {
  query: {
    type: 'object',
    properties: {
      search: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      status: { type: 'string' },
      fromDate: { type: 'string', format: 'date' },
      toDate: { type: 'string', format: 'date' },
      groupId: { type: 'number' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            chatRains: {
              type: 'array',
              items: {
                $ref: '#/definitions/chatRain'
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
