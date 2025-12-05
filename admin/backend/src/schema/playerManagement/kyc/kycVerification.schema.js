export const kycVerificationSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            emailSent: { type: 'boolean' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
