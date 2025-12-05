
export const getOffensiveWordsSchema = {
  query: {
    type: 'object',
    properties: {
      search: { type: 'string', transform: ['trim'] },
      page: { type: 'number', default: 1 },
      perPage: { type: 'number', default: 15 },
      fromDate: { type: 'string', format: 'date' },
      toDate: { type: 'string', format: 'date' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            offensiveWords: {
              type: 'array',
              items: {
                $ref: '#/definitions/offensiveWord'
              }
            },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
