
export const getChatGroupSchema = {
  query: {
    type: 'object',
    properties: {
      searchName: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      status: { type: 'string', enum: ['true', 'false'] },
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
            groups: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  chatGroupId: { type: 'number' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'boolean' },
                  groupLogo: { type: 'string' },
                  criteria: { type: 'array' },
                  isGlobal: { type: 'boolean' }
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
