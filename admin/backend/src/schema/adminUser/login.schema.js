export const loginSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                emailVerified: { type: 'boolean' },
                phone: { type: 'string' },
                phoneVerified: { type: 'string' },
                password: { type: 'string' },
                parentAdminId: { type: 'string' },
                adminRoleId: { type: 'string' },
                isActive: { type: 'boolean' },
                siteLayout: { type: 'object' },
                permission: { type: 'object' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
