import _ from 'lodash'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { GROUP_CRITERIA_ARRAY } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: ['string', 'null'], transform: ['trim', 'toLowerCase'] },
    description: { type: ['string', 'null'] },
    status: { type: 'boolean' },
    criteria: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    isGlobal: {
      type: 'boolean'
    }
  },
  required: ['name', 'status', 'description']
})

export default class CreateChatGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatGroupModel = this.context.sequelize.models.chatGroup
    const transaction = this.context.sequelizeTransaction

    try {
      const { name, description, status, criteria, isGlobal } = this.args
      const filteredCriteria = []

      const group = await ChatGroupModel.findOne({ where: { name }, transaction })
      if (group) return this.addError('ThisGroupNameAlreadyExistsErrorType')

      if (criteria && !_.isEmpty(criteria)) {
        for (const record of criteria) {
          if (!GROUP_CRITERIA_ARRAY.includes(record.key)) return this.addError('ThisCriteriaDoesNotExistsErrorType')
          if (!filteredCriteria.includes(record.key)) filteredCriteria.push({ key: record.key, value: record.value })
        }
      }

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
        criteria: filteredCriteria,
        admins: [],
        isGlobal
      }
      await ChatGroupModel.create(dataToInsert, { transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
