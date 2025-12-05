export const getLimitsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            limits: { type: 'array' },
            items: { type: 'object' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
