export const getJackpotSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            jackpotId: { type: 'string', pattern: '^[0-9]*$' },
            status: { type: 'string', enum: ['upcoming', 'running', 'completed'] },
            search: { type: 'string' },
            pageNo: { type: 'string', pattern: '^[0-9]*$' },
            limit: { type: 'string', pattern: '^[0-9]*$' },
            sort: { type: 'string', enum: ['ASC', 'DESC'] },
            orderBy: { type: 'string', enum: ['jackpotId', 'jackpotName', 'jackpotPoolEarning', 'userId', 'email', 'username', 'poolAmount', 'gameId', 'status', 'winningTicket', 'seedAmount', 'netRevenue'] }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
