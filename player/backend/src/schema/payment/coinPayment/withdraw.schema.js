export const withdrawSchema = {
  body: {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      walletId: { type: 'number' },
      currency2: { type: 'string' },
      buyer_email: { type: 'string' },
      address: { type: 'string' }
    },
    required: ['walletId', 'amount', 'address', 'currency2']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            callbackConfig: { type: 'object' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
