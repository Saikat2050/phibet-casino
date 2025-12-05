export const getAggregatorsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            aggregators: {
              type: 'array',
              items: { $ref: '#/definitions/casinoAggregator' }
            },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
