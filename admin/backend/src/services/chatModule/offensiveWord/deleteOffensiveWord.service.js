import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'number' }
  },
  required: ['id']
})

export default class DeleteOffensiveWordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { chatOffensiveWord: ChatOffensiveWordModel } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction
    const { id } = this.args

    try {
      const checkWord = await ChatOffensiveWordModel.findByPk(id)
      if (!checkWord) return this.addError('OffensiveWordNotFoundErrorType')

      await ChatOffensiveWordModel.destroy({ where: { id } }, { transaction })
      return { message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
