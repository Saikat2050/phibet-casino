export const getUserPaymentCardsSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        userPaymentCards: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              userId: { type: 'number' },
              expiryMonth: { type: 'number' },
              expiryYear: { type: 'number' },
              cardHolderName: { type: 'string' },
              cardType: { 
                type: 'string',
                enum: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'OTHER']
              },
              maskedCardNumber: { type: 'string' },
              isDefault: { type: 'boolean' },
              isActive: { type: 'boolean' },
              isCreditCard: { type: 'boolean' },
              moreDetails: { type: 'object' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  username: { type: 'string' },
                  firstName: { type: ['string', 'null'] },
                  lastName: { type: ['string', 'null'] },
                  email: { type: ['string', 'null'] }
                },
                required: ['id', 'username'],
                additionalProperties: false
              }
            },
            required: ['id', 'userId', 'expiryMonth', 'expiryYear', 'cardHolderName', 'cardType', 'maskedCardNumber', 'isDefault', 'isActive', 'isCreditCard', 'createdAt', 'updatedAt'],
            additionalProperties: false
          }
        },
        pageNo: { type: 'number' },
        totalPages: { type: 'number' },
        totalCount: { type: 'number' }
      },
      required: ['userPaymentCards', 'pageNo', 'totalPages', 'totalCount'],
      additionalProperties: false
    }
  },
  required: ['success', 'message', 'data'],
  additionalProperties: false
}