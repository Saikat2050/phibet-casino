export const getCountriesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            countries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  code: { type: 'string' },
                  name: { type: 'string' },
                  languageId: { type: 'string' },
                  isActive: { type: 'boolean' },
                  language: { type: 'string' }
                },
                required: ['id', 'code', 'name', 'languageId', 'isActive', 'language']
              }
            },
            page: { type: 'string' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
