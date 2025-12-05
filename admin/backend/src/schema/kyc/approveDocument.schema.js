export const approveDocumentSchema = {
  type: 'object',
  properties: {
    documentId: { type: 'number' },
    reason: { type: ['string', 'null'] },
    metadata: { 
      type: 'object',
      additionalProperties: true
    }
  },
  required: ['documentId']
} 