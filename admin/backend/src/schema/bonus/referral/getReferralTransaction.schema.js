export const getReferralTransactionSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            referralTransaction: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                  email: { type: 'string' },
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  status: { type: 'string' },
                  currency_id: { type: 'string' },
                  total_amount: { type: 'number' },
                  referral_count: { type: 'string' },
                  gcamount: {type: 'number'},
                  bscamount: {type: 'number'}
                }
              }
            },
            page: { type: 'string' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
