export const deleteJackpotSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        jackpotId: { type: 'number' }
      },
      required: [
        'jackpotId'
      ]
    },
    errors: { type: 'array' }
  }

}
