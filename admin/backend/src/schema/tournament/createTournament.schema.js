export const createTournamentSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            tournament: {
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
                tagIds: { type: ['array', 'null'] }
              }
            },
            messages: { type: 'string' }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
