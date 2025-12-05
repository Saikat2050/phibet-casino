export const updateChildProfileSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            childAdminUser: {
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
                updatedAt: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
