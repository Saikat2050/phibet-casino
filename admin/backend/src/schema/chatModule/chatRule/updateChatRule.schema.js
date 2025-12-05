export const updateChatRuleSchema = {
  body: {
    type: 'object',
    properties: {
      rule: { type: 'string' },
      chatRuleId: { type: 'number' }
    },
    required: ['chatRuleId', 'rule']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
