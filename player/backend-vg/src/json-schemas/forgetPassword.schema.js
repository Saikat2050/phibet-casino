import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const forgetPasswordSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    phone: {
      type: 'string',
      maxLength: 10,
      minLength: 10
    },
    phoneCode: {
      type: 'string',
      maxLength: 3
    }
  },
  anyOf: [{ required: ['email'] }, { required: ['phoneCode', 'phone'] }]
}

ajv.addSchema(forgetPasswordSchema, '/forgetPassword.json')

/** @type {import("ajv").Schema} */
const otpSentForgetPasswordSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    code: {
      type: 'string'
    },
    phone: {
      type: 'string',
      maxLength: 10,
      minLength: 10
    },
    phoneCode: {
      type: 'string',
      maxLength: 3
    }
  },
  anyOf: [
    { required: ['email', 'code'] },
    { required: ['phone', 'phoneCode'] }
  ]
}

ajv.addSchema(otpSentForgetPasswordSchema, '/otpSentForgetPasswordSchema.json')
