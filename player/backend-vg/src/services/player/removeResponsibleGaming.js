import ajv from '../../libs/ajv'
import ServiceBase from '../serviceBase'
import { getOne } from '../../utils/crud'

import { RESPONSIBLE_GAMBLING_STATUS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limitType: {
      type: 'string'
    },
    responsibleGamblingType: {
      type: 'string'
    }
  }
}

const constraints = ajv.compile(schema)

export class RemoveResponsibleGamingService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req:
      {
        body: {
          limitType,
          responsibleGamblingType
        },
        user: {
          detail: user
        }
      },
      dbModels: {
        ResponsibleGambling: ResponsibleGamblingModel
      },
      sequelizeTransaction: t
    } = this.context
    const response = await getOne({
      model: ResponsibleGamblingModel,
      data: { responsibleGamblingType, limitType, userId: user?.userId, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE, isRemoved: false }
    })
    if (!response) {
      return this.addError('ResponsibleSettingNotFondType')
    }

    const settingCreateTime = response?.createdAt
    const timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
    if (timeDifference >= 24) {
      response.isRemoved = true
      response.status = RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE
      await response.save({ transaction: t })
      return { success: true, message: 'Record Removed Successfully' }
    } else {
      return this.addError('RemoveTimeError')
    }
  }
}
