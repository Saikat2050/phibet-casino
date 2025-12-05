export const getUserListSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            allUsers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  username: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' }
                }
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' },
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
