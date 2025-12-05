export const userGoogleSignupLoginSchema = {
  body: {
    type: 'object',
    properties: {
      credential: { type: 'string', transform: ['trim'] },
      referralCode: { type: 'string', transform: ['trim'] },
      username: { type: 'string', transform: ['trim'] }
    },
    required: ['credential']
  }
}
