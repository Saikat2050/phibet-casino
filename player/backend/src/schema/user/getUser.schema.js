export const getUserSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            referralCode: { type: 'string' },
            welcomeBonus: { type: ['object', 'null'] },
            birthdayBonus: { type: ['object', 'null'] },
            getWelcomePackage: { type: ['object', 'null'] },
            amoeBonus: { type: ['object', 'null'] }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
