export const getPlayerPerformanceSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            reportData: { type: 'array', items: { type: 'object' } },
            page: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
