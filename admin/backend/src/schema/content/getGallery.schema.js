export const getGallerySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            gallery: { type: ['array', 'string'] }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
