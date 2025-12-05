export const getJackpotGraphSchema = {
  querySchema: {
    type: 'object',
    properties: {
      startDate: { anyOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }] },
      endDate: { anyOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }] },
      timeInterval: { type: 'string', enum: ['auto', '30-minutes', 'hour', '3-hours', '12-hours', 'day', '3-days', 'week', 'month'] }
    },
    required: ['startDate', 'endDate', 'timeInterval']
  }
}
