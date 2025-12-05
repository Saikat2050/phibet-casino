import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const verifyForgetPasswordSchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string'
    },
    newPasswordKey: {
      type: 'string'
    },
    confirmPassword: {
      type: 'string'
    }
  },
  required: ['newPasswordKey', 'password', 'confirmPassword']
}

ajv.addSchema(verifyForgetPasswordSchema, '/verifyForgetPassword.json')
