import { WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'

export const getWithdrawalSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  userId: { type: 'number' },
                  status: { enum: Object.values(WITHDRAWAL_STATUS) },
                  amount: { type: 'number' },
                  transactionId: { type: 'string' },
                  approvedAt: { type: 'string' },
                  createdAt: { type: 'string' },
                  confirmedAt: { type: 'string' }
                },
                required: ['id', 'userId', 'status', 'amount', 'transactionId', 'approvedAt']
              }
            },
            totalPages: { type: 'number' },
            page: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
