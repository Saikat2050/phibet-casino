export const getReferralUserSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            referredUser: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  emailVerified: { type: 'boolean' },
                  phoneCode: { type: 'string' },
                  phone: { type: 'string' },
                  phoneVerified: { type: 'boolean' },
                  languageId: { type: 'string' },
                  dateOfBirth: { type: 'string' },
                  gender: { type: 'string' },
                  loggedIn: { type: 'boolean' },
                  imageUrl: { type: 'string' },
                  kycStatus: { type: ['string', 'null'] },
                  isActive: { type: 'boolean' },
                  countryId: { type: 'string' },
                  sessionLimit: { type: 'string' },
                  referredBy: { type: 'string' }
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
