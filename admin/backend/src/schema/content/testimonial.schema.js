export const testimonialSchema = {
  response: {
    201: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            testimonial: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                author: { type: 'string' },
                content: { type: 'string' },
                is_active: { type: 'boolean' },
                rating: { type: 'number' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        errors: {
          type: 'array',
          maxItems: 0
        }
      }
    }
  }
}
