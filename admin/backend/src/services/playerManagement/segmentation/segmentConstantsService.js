import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { OPERATORS, SEGMENT_CATEGORIES } from '@src/utils/constants/segmentation.constants.utils'

export class SegmentConstantsService extends ServiceBase {
  async run () {
    try {
      const segments = SEGMENT_CATEGORIES
      const operators = OPERATORS
      return { segments, operators }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
