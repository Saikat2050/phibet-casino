export const getChildrenSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            admin: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                emailVerified: { type: 'boolean' },
                adminRoleId: { type: 'string' },
                isActive: { type: 'boolean' },
                children: { type: 'array'}
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
