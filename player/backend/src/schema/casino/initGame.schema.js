export const initGameSchema = {
  body: {
    type: 'object',
    properties: {
      gameId: { type: 'string' },
      demo: { type: 'string' },
      deviceType: { type: 'string', enum: ['Desktop', 'Mobile', null, ''] },
      tournamentId: { type: 'number' }
    },
    required: ['gameId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object'
        },
        errors: { type: 'array' }
      }
    }
  }
}
