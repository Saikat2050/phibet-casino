
export const getGroupUsersSchema = {
  query: {
    type: 'object',
    properties: {
      search: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      chatGroupId: { type: 'string' },
      userId: { type: 'number' }
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
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' }
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
