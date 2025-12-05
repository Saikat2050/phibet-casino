export const bannerUploadSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            banner: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                imageUrl: { type: 'array' },
                mobileImageUrl: { type: 'array' },
                updatedAt: { type: 'string' },
                createdAt: { type: 'string' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
