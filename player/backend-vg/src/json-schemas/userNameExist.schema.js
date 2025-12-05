import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const isUserNameExist = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    }
  },
  required: ['username']
}

ajv.addSchema(isUserNameExist, '/userNameExist.json')
