import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const loginSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    otp: {
      type: 'string'
    }
  },
  required: ['email', 'otp']
}

ajv.addSchema(loginSchema, '/verifyEmail.json')
