export const deleteSegmentSchema = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'number' }
    },
    required: ['id']
  }
}
