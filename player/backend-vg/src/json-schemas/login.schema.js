import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const loginSchema = {
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
    sessionKey: {
      type: 'string'
    },
    userLocation: {
      type: 'object'
    },
    rtyuioo: {
      type: 'boolean'
    },
    fingerprintVisitorId: {
      type: 'string'
    },
    fingerprintRequestId: {
      type: 'string'
    }
  },
  required: ['email', 'password', 'fingerprintVisitorId', 'fingerprintRequestId']
}

ajv.addSchema(loginSchema, '/login.json')

const googleLoginSchema = {
  type: 'object',
  properties: {
    credential: { type: 'string' },
    username: { type: 'string' },
    isSignup: { type: 'boolean', enum: [true, false] },
    isTermsAccepted: { type: 'boolean', enum: [true, false] },
    browser: { type: 'string' },
    platform: { type: 'string' },
    referralCode: { type: ['string', 'null'] },
    affiliateCode: { type: ['string', 'null'] },
    affiliateId: { type: ['string', 'null'] },
    promocode: { type: 'string' },
    sessionKey: { type: 'string' },
    sokulId: { type: 'string' },
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
  required: ['credential', 'isSignup', 'fingerprintVisitorId', 'fingerprintRequestId']
}

ajv.addSchema(googleLoginSchema, '/google-login.json')

const facebookLoginSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: ['string', 'null'] },
    isSignup: { type: 'boolean', enum: [true, false] },
    isTermsAccepted: { type: 'boolean', enum: [true, false] },
    userId: { type: 'string' },
    username: { type: 'string' },
    browser: { type: 'string' },
    platform: { type: 'string' },
    referralCode: { type: ['string', 'null'] },
    affiliateCode: { type: ['string', 'null'] },
    affiliateId: { type: ['string', 'null'] },
    promocode: { type: 'string' },
    isForceEmail: { type: 'boolean', enum: [true, false] },
    sokulId: { type: 'string' },
    sessionKey: { type: 'string' },
    userLocation: {
      type: 'object'
    },
    fingerprintVisitorId: {
      type: 'string'
    },
    fingerprintRequestId: {
      type: 'string'
    }
    // fingerprintVisitorId: {
    //   type: 'string'
    // },
    // fingerprintRequestId: {
    //   type: 'string'
    // }
  },
  required: ['firstName', 'lastName', 'userId', 'isSignup', 'email', 'isForceEmail']
  // required: ['firstName', 'lastName', 'userId', 'isSignup', 'email', 'isForceEmail', 'fingerprintVisitorId', 'fingerprintRequestId']
}

ajv.addSchema(facebookLoginSchema, '/facebook-login.json')

const appleLoginSchema = {
  type: 'object',
  properties: {
    authorization: { type: 'object' },
    isSignup: { type: 'boolean', enum: [true, false] },
    isTermsAccepted: { type: 'boolean', enum: [true, false] },
    browser: { type: 'string' },
    platform: { type: 'string' },
    referralCode: { type: ['string', 'null'] },
    affiliateCode: { type: ['string', 'null'] },
    affiliateId: { type: ['string', 'null'] },
    promocode: { type: 'string' },
    sessionKey: { type: 'string' },
    sokulId: { type: 'string' },
    userLocation: {
      type: 'object'
    },
    fingerprintVisitorId: {
      type: 'string'
    },
    fingerprintRequestId: {
      type: 'string'
    }
    // fingerprintVisitorId: {
    //   type: 'string'
    // },
    // fingerprintRequestId: {
    //   type: 'string'
    // }
  },
  required: ['authorization', 'isSignup']
  // required: ['authorization', 'isSignup', 'fingerprintVisitorId', 'fingerprintRequestId']
}

ajv.addSchema(appleLoginSchema, '/apple-login.json')
