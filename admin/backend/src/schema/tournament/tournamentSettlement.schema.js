export const tournamentSettlementSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            prizeDistributionMapping: { type: 'object' },
            messages: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
