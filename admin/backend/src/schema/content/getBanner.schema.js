export const getBannerSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            banners: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  type: { type: 'string' },
                  imageUrl: { type: 'array' },
                  mobileImageUrl: { type: 'array' }
                },
                required: ['id', 'imageUrl']
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
