export const getPlayerSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            user: {
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
                userTags: { type: 'array' },
                userLimits: { type: 'array' },
                wallets: { type: 'array' },
                userComment: { type: ['object', 'null'] },
                addresses: { type: 'array' },
                referral: { type: ['object', 'null'] },
                affiliateId: { type: 'string' },
                affiliateCode: { type: 'string' },
                uniqueId: { type: 'string' },
                isProfile: { type: 'boolean' },
                moreDetails: { type: ['object', 'null'] }
              }
            },
            playerStats: { type: ['object', 'null', 'array'] }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
