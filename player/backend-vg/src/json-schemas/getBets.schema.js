import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const getBets = {
  type: 'object',
  properties: {
    limit: {
      type: 'string'
    },
    page: {
      type: 'string'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    actionType: {
      type: 'string'
    },
    coinType: {
      type: 'string'
    },
    status: {
      type: 'string'
    }
  },
  required: []
}

ajv.addSchema(getBets, '/getBets.json')
