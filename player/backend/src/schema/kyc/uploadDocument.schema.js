export default {
  type: 'object',
  properties: {
    documentLabelId: {
      type: 'integer',
      minimum: 1,
      description: 'ID of the document label'
    }
  },
  required: ['documentLabelId'],
  additionalProperties: false
}
