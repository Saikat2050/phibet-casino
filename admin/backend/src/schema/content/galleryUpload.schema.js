export const galleryUploadSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            file: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
