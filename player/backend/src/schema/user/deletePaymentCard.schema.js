export const deletePaymentCardSchema = {
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
        cardId: {
          type: 'string',
          minLength: 1
        }
      },
      required: ['cardId'],
      additionalProperties: false
    }
  },
  required: ['query']
}