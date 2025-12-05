import { USER_GENDER } from '@src/utils/constants/public.constants.utils'

export const userSignupSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', transform: ['trim', 'toLowerCase'] },
      phone: { type: 'string', transform: ['trim'] },
      username: { type: 'string', transform: ['trim'] },
      firstName: { type: 'string', transform: ['trim'] },
      lastName: { type: 'string', transform: ['trim'] },
      phoneCode: { type: 'string', transform: ['trim'] },
      dateOfBirth: { type: 'string', transform: ['trim'] },
      password: { type: 'string', transform: ['trim'] },
      gender: { enum: Object.values(USER_GENDER) },
      referralCode: { type: 'string', transform: ['trim'] },
      sessionKey: { type: 'string' },
      affiliateCode: { type: 'string' },
      affiliateId: { type: 'string' }
    },
    required: ['email', 'password']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: { type: 'object' },
            accessToken: { type: 'string' },
            joiningBonus: { type: ['object', 'null'] },
            activeBonus: { type: ['object', 'null'] },
            getWelcomePackage: { type: 'object' },
            amoeBonus: { type: ['object', 'null'] }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
