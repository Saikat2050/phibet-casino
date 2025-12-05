export const getKPISummarySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            kpiSummary: { type: 'object' }
          },
          required: ['kpiSummary']
        },
        errors: { type: 'array' }
      }
    }
  }
}
