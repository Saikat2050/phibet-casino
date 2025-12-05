export const tournamentCancelSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            casinoTournament: { type: 'object' },
            messages: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
