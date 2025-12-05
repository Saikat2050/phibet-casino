export const rejectDocumentSchema = {
  type: 'object',
  properties: {
    documentId: { type: 'number' },
    reason: { type: 'string' },
    metadata: { 
      type: 'object',
      additionalProperties: true
    }
  },
  required: ['documentId', 'reason']
} 