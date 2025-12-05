import { USER_GENDER } from '@src/utils/constants/public.constants.utils'

export const userUpdateSchema = {
  body: {
    type: 'object',
    properties: {
      phone: { type: 'string', transform: ['trim'] },
      username: { type: 'string', transform: ['trim'] },
      firstName: { type: 'string', transform: ['trim'] },
      lastName: { type: 'string', transform: ['trim'] },
      phoneCode: { type: 'string', transform: ['trim'] },
      dateOfBirth: { type: 'string', transform: ['trim'] },
      password: { type: 'string', transform: ['trim'] },
      gender: { enum: [...Object.values(USER_GENDER), 'other'] },
      email: { type: 'string' },
      otp: { type: 'string' },
      address1: { type: 'string', transform: ['trim'] },
      address2: { type: 'string', transform: ['trim'] },
      city: { type: 'string', transform: ['trim'] },
      zipCode: { type: 'string', transform: ['trim'] },
      sessionKey: { type: 'string' },
      stateCode: { type: 'string', transform: ['trim'] }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            user: { type: 'object' },
            errors: { type: 'array' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
