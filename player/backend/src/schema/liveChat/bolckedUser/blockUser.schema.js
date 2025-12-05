export const blockReportedUserSchema = {
  body: {
    type: 'object',
    properties: {
      reportedUserId: { type: 'number' },
      groupId: { type: 'number' },
      description: { type: 'string' }
    },
    required: ['reportedUserId', 'groupId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            report: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                actioneeId: { type: 'number' },
                reportedUserId: { type: 'number' },
                groupId: { type: 'number' },
                description: { type: 'string' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' }
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
