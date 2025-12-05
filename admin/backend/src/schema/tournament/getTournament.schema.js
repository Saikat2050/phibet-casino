export const getTournamentSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            casinoTournaments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  isActive: { type: 'boolean' },
                  id: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  registrationEndDate: { type: 'string' },
                  status: { type: 'string' },
                  name: { type: 'object' },
                  description: { type: 'object' },
                  creditPoints: { type: 'number' },
                  updatedAt: { type: 'string' },
                  createdAt: { type: 'string' },
                  image: { type: 'string' },
                  tournamentCurrencies: { type: 'array' },
                  tagIds: { type: ['array', 'null'] }
                }
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
