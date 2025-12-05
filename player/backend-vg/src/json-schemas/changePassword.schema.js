import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const changePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string'
    },
    newPassword: {
      type: 'string'
    }
  },
  required: ['oldPassword', 'newPassword']
}

ajv.addSchema(changePasswordSchema, '/changePassword.json')
