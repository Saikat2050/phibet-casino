export const getReportedUserSchema = {
  query: {
    type: 'object',
    properties: {
      search: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      userId: { type: 'string' },
      fromDate: { type: 'string', format: 'date' },
      toDate: { type: 'string', format: 'date' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            reportedUser: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  reportCount: { type: 'number' },
                  reportedUsers: { type: 'object' }
                }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
