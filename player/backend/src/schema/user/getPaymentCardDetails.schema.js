export const getPaymentCardDetailsSchema = {
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
            cardNumber: { type: 'string' },
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
          required: ['id', 'cardType', 'cardHolderName', 'cardNumber', 'maskedCardNumber', 'expiryMonth', 'expiryYear', 'isDefault', 'isActive', 'isCreditCard']
        },
        errors: { type: 'array' }
      }
    }
  }
}