import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { requestInputValidation } from '@src/helpers/segmentation.helper'
import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import {} from '@src/services/playerManagement/segmentation/getSegmentUsersService'
import { GetSegmentationUsersService } from './getSegmentUsersService'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    condition: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    download: { type: 'boolean', default: false },
    email: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['condition']
})

export class SegmentationAdvancedFilterService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { args: { condition, page, perPage, download, email } } = this

    try {
      const validateCondition = requestInputValidation(condition)
      if (validateCondition?.length > 0) return new RequestInputValidationError(validateCondition)

      const { result } = await GetSegmentationUsersService.execute({ id: 0, page, perPage, isAdvancedFilter: true, advancedFilterConditions: condition, download, email }, this.context)

      return result
    } catch (error) {
      throw new APIError(error)
    }
  }
}
