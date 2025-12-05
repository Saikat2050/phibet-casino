export const getReportedUserSchema = {
  query: {
    type: 'object',
    properties: {
      limit: { type: 'string' },
      pageNo: { type: 'string' },
      search: { type: 'string' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      id: { type: 'string' }
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
                  id: { type: 'number' },
                  isUnblocked: { type: 'boolean' },
                  actioneeId: { type: 'number' },
                  description: { type: 'string' },
                  reportedUserId: { type: 'number' },
                  reportedUsers: { type: ['object', 'null'] },
                  groupId: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          },
          required: ['reportedUser', 'page','totalPages']
        },
        errors: { type: 'array' }
      }
    }
  }
}
