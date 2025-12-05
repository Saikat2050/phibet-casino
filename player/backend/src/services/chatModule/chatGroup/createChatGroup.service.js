import _ from "lodash";
import ajv from "@src/libs/ajv";
import { APIError } from "@src/errors/api.error";
import ServiceBase from "@src/libs/serviceBase";

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: ['string', 'null'], transform: ['trim', 'toLowerCase'] },
    description: { type: ['string', 'null'] },
    userId: { type: 'number' }
  },
  required: ['name', 'description', 'userId']
})

export default class CreateChatGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      chatGroup: ChatGroupModel
    } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction

    try {
      const {
        name,
        description,
        status = true,
        isGlobal = false
      } = this.args

      const group = await ChatGroupModel.findOne({
        where: { name },
        transaction
      })
      if (group) return this.addError('ThisGroupNameAlreadyExistsErrorType')

      if (isGlobal === true) {
        const globalGroup = await ChatGroupModel.findOne({
          where: { isGlobal: true },
          transaction
        })
        if (globalGroup) return this.addError('GlobalGroupExistErrorType')
      }

      const dataToInsert = {
        name,
        description,
        status,
        criteria: [],
        admins: [Number(this.args.userId)],
        isGlobal
      }
      await ChatGroupModel.create(dataToInsert, { transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
