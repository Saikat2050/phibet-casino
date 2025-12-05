export const getCurrenciesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            currencies: {
              type: 'array',
              items: { $ref: '#/definitions/currency' }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
