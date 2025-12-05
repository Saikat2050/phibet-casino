export const createTestimonialSchema = {
  body: {
    type: 'object',
    required: ['author', 'content', 'isActive'],
    properties: {
      author: { type: 'string', minLength: 1 },
      content: { type: 'string', minLength: 1 },
      isActive: { type: 'boolean' },
      rating: { type: 'number' }
    },
    additionalProperties: false
  }
}
