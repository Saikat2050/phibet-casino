export const updateLimitsSchema = {
  body: {
    type: 'object',
    properties: {
      value: { type: 'string' },
      limitId: { type: 'string' }
    },
    required: ['limitId', 'value']
  }
}
