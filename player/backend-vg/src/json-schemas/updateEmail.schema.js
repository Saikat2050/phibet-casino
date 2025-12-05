import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const updateEmailSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    otp: {
      type: 'string'
    }
  },
  required: ['email']
}

ajv.addSchema(updateEmailSchema, '/updateEmail.json')
