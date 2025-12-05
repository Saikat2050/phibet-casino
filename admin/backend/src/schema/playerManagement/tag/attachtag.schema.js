export const attachTagSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
