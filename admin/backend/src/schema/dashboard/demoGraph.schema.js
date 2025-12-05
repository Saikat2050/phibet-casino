export const getDemoGraphSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            demograph: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  countryCode: { type: 'string' },
                  countryName: { type: 'string' },
                  deposits: { type: 'array' },
                  signUpCount: { type: 'number' }
                },
                required: ['countryCode', 'countryName', 'deposits', 'signUpCount']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
