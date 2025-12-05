import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const signUpSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    password: {
      type: 'string'
    },
    isTermsAccepted: {
      type: 'boolean'
    },
    browser: {
      type: 'string'
    },
    platform: {
      type: 'string'
    },
    referralCode: {
      type: ['string', 'null']
    },
    affiliateCode: {
      type: 'string'
    },
    affiliateId: {
      type: 'string'
    },
    promocode: {
      type: 'string'
    },
    sessionKey: {
      type: 'string'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    sokulId: {
      type: 'string'
    },
    userLocation: {
      type: 'object'
    },
    fingerprintVisitorId: {
      type: 'string'
    },
    fingerprintRequestId: {
      type: 'string'
    }
  },
  required: ['email', 'password', 'isTermsAccepted', 'browser', 'platform', 'firstName', 'lastName', 'fingerprintVisitorId', 'fingerprintRequestId']
}

ajv.addSchema(signUpSchema, '/signUp.json')
