import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    tagId: { type: 'string' },
    toDate: { type: 'string' }
  },
  required: ['tagId', 'toDate']
})

export class HelloService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      this.addError('RequestInputValidationErrorType', 'shivam1')
      this.addError('InvalidSocketArgumentErrorType', 'shivam2')
      // throw 'shivam'
      return { name: 'shivam' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
