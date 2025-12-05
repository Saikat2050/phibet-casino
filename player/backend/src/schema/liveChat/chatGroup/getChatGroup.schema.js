export const getChatGroupSchema = {
  query: {
    type: 'object',
    properties: {
      search: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      fromDate: { type: 'string' },
      toDate: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            groupDetails: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'boolean' },
                  criteria: { type: 'array' },
                  createdAt: { type: 'string' },
                  isGlobal: { type: 'boolean' },
                  isJoined: { type: 'boolean' },
                  restrictions: {
                    type: 'object',
                    properties: {
                      isRestricted: { type: 'boolean' },
                      reason: { type: 'array' }
                    }
                  }

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
