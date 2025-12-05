export const checkUserSchema = {
  query: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      username: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            emailExists: { type: 'boolean' },
            usernameExists: { type: 'boolean' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
