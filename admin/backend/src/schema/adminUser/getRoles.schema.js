export const getRolesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  level: { type: 'number' }
                },
                required: ['id', 'name', 'level']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
