export const depositSchema = {
  body: {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      walletId: { type: 'number' },
      currency2: { type: 'string' },
      buyer_email: { type: 'string' }
    },
    required: ['walletId', 'amount', 'currency2']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        errors: { type: 'array' }
      }
    }
  }
}
