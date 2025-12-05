export const getStaffSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            staff: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  parentAdminId: { type: 'string' },
                  email: { type: 'string' },
                  emailVerified: { type: 'boolean' },
                  adminRoleId: { type: 'string' },
                  isActive: { type: 'boolean' },
                  permission: { type: 'object' },
                  adminRole: { type: 'object' }
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
