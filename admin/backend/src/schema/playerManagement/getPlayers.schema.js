export const getPlayersSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  uniqueId: { type: 'string' },
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
                  lastLoggedInIp: { type: 'string' },
                  loggedInAt: { type: 'string' },
                  imageUrl: { type: 'string' },
                  kycStatus: { type: ['string', 'null'] },
                  isActive: { type: 'boolean' },
                  countryId: { type: 'string' },
                  sessionLimit: { type: 'string' },
                  referredBy: { type: 'string' },
                  createdAt: { type: 'string' },
                  country: { type: 'object' },
                  userTags: { type: 'array' }
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
