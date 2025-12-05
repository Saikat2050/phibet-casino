import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'

const schema = {
  type: 'object',
  properties: {
    promocode: { type: 'string' }
  },
  required: ['promocode']
}

const constraints = ajv.compile(schema)
export class DeletePromoCodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { promocode: promoCodeModel } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction

    const { promocode } = this.args
    try {
      const promocodeExist = await promoCodeModel.findOne({
        where: { promocode: promocode },
        transaction
      })

      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      // Soft delete: set isArchived to true and isactive false with update deletedAt
      await promoCodeModel.update(
        {
          isArchived: true,
          deletedAt: new Date(),
          isActive: false
        },
        {
          where: { promocode },
          transaction
        }
      )
      return {
        success: true,
        message: SUCCESS_MSG.DELETE_SUCCESS
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
