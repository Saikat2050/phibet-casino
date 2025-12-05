export const updateKycStatusSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    kycStatus: { 
      type: 'string',
      enum: ['PENDING', 'COMPLETE', 'FAILED', 'IN_PROGRESS', 'CREATED', 'ACTIVATED', 'PROCESSING', 'ARCHIVED']
    },
    kycLevel: { 
      type: 'number',
      enum: [0, 1, 2, 3, 4]
    },
    reason: { type: ['string', 'null'] },
    metadata: { 
      type: 'object',
      additionalProperties: true
    }
  },
  required: ['userId']
} 