import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    words: { type: 'string' }
  },
  required: ['words']
})

export default class CreateOffensiveWordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { chatOffensiveWord: ChatOffensiveWordModel, chatDetail: ChatDetailModel } = this.context.sequelize.models

    try {
      const { words } = this.args
      const checkWord = await ChatOffensiveWordModel.findOne({ where: { words } })
      if (checkWord) return this.addError('OffensiveWordAlreadyExistErrorType')
      await ChatOffensiveWordModel.create({ words }, { transaction })

      const AllChatDetails = await ChatDetailModel.findAll({
        attributes: ['id'],
        where: { message: { [Op.like]: `%${words}%` } },
        transaction
      })

      if (AllChatDetails.length > 0) {
        await ChatDetailModel.update({ isOffensive: true }, { where: { id: AllChatDetails.map(detail => detail.id) }, transaction });
      }


      return { message: SUCCESS_MSG.CREATE_SUCCESS, words }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
