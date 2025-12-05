export const getProvidersSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            providers: {
              type: 'array',
              items: { $ref: '#/definitions/casinoProvider' }
            },
            totalPages: { type: 'number' },
            page: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
