export const userLoginSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', transform: ['trim', 'toLowerCase'], format: 'email' },
      password: { type: 'string', transform: ['trim'] },
      otp: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: { type: 'object' },
            activeBonus: { type: 'object' },
            welcomeBonus: { type: ['object', 'null'] },
            getWelcomePackage: { type: 'object' },
            amoeBonus: { type: ['object', 'null'] }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
