export const getUserDocumentsSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    documents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          userId: { type: 'number' },
          documentLabelId: { type: 'number' },
          fileName: { type: 'string' },
          originalFileName: { type: 'string' },
          fileUrl: { type: 'string' },
          fileSize: { type: 'number' },
          mimeType: { type: 'string' },
          status: { type: 'string' },
          rejectionReason: { type: ['string', 'null'] },
          expiryDate: { type: ['string', 'null'] },
          reviewedBy: { type: ['number', 'null'] },
          reviewedAt: { type: ['string', 'null'] },
          metadata: { type: 'object' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          documentLabel: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: ['string', 'null'] },
              isRequired: { type: 'boolean' },
              kycLevel: { type: 'number' }
            }
          },
          reviewer: {
            type: ['object', 'null'],
            properties: {
              id: { type: 'number' },
              username: { type: 'string' },
              firstName: { type: ['string', 'null'] },
              lastName: { type: ['string', 'null'] }
            }
          }
        }
      }
    },
    pagination: {
      type: 'object',
      properties: {
        currentPage: { type: 'number' },
        totalPages: { type: 'number' },
        totalItems: { type: 'number' },
        itemsPerPage: { type: 'number' },
        hasNextPage: { type: 'boolean' },
        hasPrevPage: { type: 'boolean' }
      }
    }
  },
  required: ['success', 'documents', 'pagination']
} 