export const manageWalletSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            ledgerId: { type: 'string' },
            status: { type: 'string' },
            actioneeId: { type: 'string' },
            paymentId: { type: 'string' },
            paymentProviderId: { type: 'string' },
            moreDetails: { type: 'string' },
            updatedAt: { type: 'string' },
            createdAt: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
