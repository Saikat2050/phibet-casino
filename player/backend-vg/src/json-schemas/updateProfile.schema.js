import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const updateProfileSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    middleName: {
      type: 'string'
    },
    dateOfBirth: {
      type: 'string'
    },
    title: {
      enum: ['Mr', 'Mrs', 'Ms']
    },
    gender: {
      enum: ['Male', 'Female']
    },
    addressLine_1: {
      type: 'string'
    },
    addressLine_2: {
      type: ['string', 'null']
    },
    city: {
      type: 'string'
    },
    state: {
      type: 'number'
    },
    country: {
      type: 'number'
    },
    zipCode: {
      type: 'string'
    },
    ssn: {
      type: 'string'
    },
    sessionKey: {
      type: 'string'
    },
    userLocation: {
      type: 'object'
    }
  },
  required: [
    'firstName',
    'lastName',
    'dateOfBirth',
    'city',
    'state',
    'country',
    'zipCode',
    'gender'
  ]
}

ajv.addSchema(updateProfileSchema, '/updateProfile.json')

const updateSelfProfileSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    }
  }
}
ajv.addSchema(updateSelfProfileSchema, '/updateProfileUsername.json')
