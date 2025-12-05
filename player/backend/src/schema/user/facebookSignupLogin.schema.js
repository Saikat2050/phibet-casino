export const facebookSignupLoginSchema = {
  body: {
    type: 'object',
    properties: {
      firstName: { type: 'string', transform: ['trim'] },
      lastName: { type: 'string', transform: ['trim'] },
      email: { type: 'string', transform: ['trim'] },
      referralCode: { type: 'string', transform: ['trim'] },
      isSignup: { type: 'boolean' },
      username: { type: 'string', transform: ['trim'] }
    },
    required: ['email', 'isSignup']
  }
}
