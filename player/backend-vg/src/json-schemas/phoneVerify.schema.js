import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const verifyPhone = {
  type: 'object',
  properties: {
    otp: {
      type: 'string'
    }
  },
  required: ['otp']
}

ajv.addSchema(verifyPhone, '/verifyPhone.json')
