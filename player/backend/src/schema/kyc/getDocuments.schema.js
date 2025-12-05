import { DOCUMENT_STATUS } from "@src/utils/constants/public.constants.utils"

export default {
  type: 'object',
  properties: {
    // status: {
    //   type: 'string',
    //   enum: [...new Set(Object.values(DOCUMENT_STATUS))],
    //   description: 'Filter documents by status'
    // },
    // documentLabelId: {
    //   type: 'integer',
    //   minimum: 1,
    //   description: 'Filter documents by label ID'
    // },
    page: {
      type: 'integer',
      minimum: 1,
      default: 1,
      description: 'Page number for pagination'
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
      description: 'Number of items per page'
    }
  },
  additionalProperties: false
}
