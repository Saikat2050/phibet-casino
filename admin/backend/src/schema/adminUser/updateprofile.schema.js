export const updateProfileSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            adminUser: {
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
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                siteLayout: { type: 'object' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
