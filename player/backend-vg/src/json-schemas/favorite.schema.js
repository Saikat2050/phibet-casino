import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const favorite = {
  type: 'object',
  properties: {
    gameId: {
      type: 'integer'
    },
    request: {
      type: 'boolean'
    }
  },
  required: ['gameId']
}

ajv.addSchema(favorite, '/favorite.json')

const getFavourateGamesSchemas = {
  type: 'object',
  properties: {
    limit: {
      type: 'string'
    },
    page: {
      type: 'string'
    }
  },
  required: []
}

ajv.addSchema(getFavourateGamesSchemas, '/getFavouriteGamesSchemas.json')
