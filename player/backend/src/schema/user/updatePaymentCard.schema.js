export const updatePaymentCardSchema = {
  body: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
      },
      cardNumber: {
        type: 'string',
      },
      expiryMonth: {
        type: 'integer',
        minimum: 1,
        maximum: 12
      },
      expiryYear: {
        type: 'integer',
        minimum: new Date().getFullYear()
      },
      cardHolderName: {
        type: 'string',
        minLength: 2,
        maxLength: 100
      },
      cardType: {
        type: 'string',
        enum: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'OTHER']
      },
      isDefault: {
        type: 'boolean'
      },
      isCreditCard: {
        type: 'boolean'
      },
      moreDetails: {
        type: 'object'
      }
    },
    required: ['cardId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            cardType: { type: 'string' },
            cardHolderName: { type: 'string' },
            maskedCardNumber: { type: 'string' },
            expiryMonth: { type: 'integer' },
            expiryYear: { type: 'integer' },
            isDefault: { type: 'boolean' },
            isActive: { type: 'boolean' },
            isCreditCard: { type: 'boolean' },
            moreDetails: { type: 'object' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          },
          required: ['id', 'cardType', 'cardHolderName', 'maskedCardNumber', 'expiryMonth', 'expiryYear', 'isDefault', 'isActive', 'isCreditCard']
        },
        errors: { type: 'array' }
      }
    }
  }
}
