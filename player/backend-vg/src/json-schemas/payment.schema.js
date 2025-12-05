import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const initPaySchema = {
  type: 'object',
  properties: {
    paymentType: { type: 'string', enum: ['deposit', 'redeem'] },
    amount: { type: ['number', 'null'] },
    packageId: { type: ['number', 'null'] },
    actionableEmail: { type: 'string' },
    promocode: { type: ['string', 'null'] },
    sessionKey: { type: 'string' },
    paymentProvider: { type: 'string' },
    bankAccountId: { type: 'string' }
  },
  anyOf: [
    {
      required: ['packageId', 'paymentType']
    },
    {
      required: ['paymentType', 'amount']
    }
  ]
}
ajv.addSchema(initPaySchema, '/initPay.json')

const cancelRedeemRequestSchema = {
  type: 'object',
  properties: {
    transactionId: { type: 'string' }
  },
  required: ['transactionId']
}
ajv.addSchema(cancelRedeemRequestSchema, '/cancel-redeem-request.json')

const getRedeemRequests = {
  type: 'object',
  properties: {
    limit: {
      type: 'string'
    },
    page: {
      type: 'string'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['pending', 'success', 'failed', 'cancelled', 'all']
    }
  }
}
ajv.addSchema(getRedeemRequests, '/getRedeemRequests.json')

const getBankDetails = {
  type: 'object',
  properties: {
    detailType: { type: 'string', enum: ['checking', 'savings'] }
  },
  required: ['detailType']
}
ajv.addSchema(getBankDetails, '/getBankDetails.json')

const editBankDetails = {
  type: 'object',
  properties: {
    bankName: { type: 'string' },
    holderName: { type: 'string' },
    accountNumber: { type: 'string' },
    routingNumber: { type: 'string', pattern: '^[0-9]{9}$' },
    detailType: { type: 'string', enum: ['checking', 'savings'] }
  },
  required: [
    'routingNumber',
    'detailType',
    'bankName',
    'holderName',
    'accountNumber'
  ]
}
ajv.addSchema(editBankDetails, '/editBankDetails.json')

const getPaymentStatus = {
  type: 'object',
  properties: {
    providerType: { type: 'string', enum: ['crypto', 'fiat'] },
    paymentReference: { type: 'string' }
  },
  required: ['providerType', 'paymentReference']
}
ajv.addSchema(getPaymentStatus, '/getPaymentStatus.json')
