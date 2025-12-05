import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { isNull } from 'lodash'
import { Op } from 'sequelize'
import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    // userId: { type: 'string' },
    wheelConfiguration: { type: 'array' }
  },
  required: ['wheelConfiguration']
})

export class PrepareWheelConfigurationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { wheelConfiguration } = this.args

    try {
      const TODAY_START = new Date().setHours(0, 0, 0, 0)
      const NOW = new Date()
      const userSpinData = await this.context.sequelize.models.userBonus.findAll({
        attributes: [
          'user_id',
          [sequelize.literal("more_details ->> 'wheelDivisionId'"), 'wheelDivisionId'],
          [sequelize.fn('COUNT', sequelize.literal('*')), 'wheelDivisionIdCount']
        ],
        where: {
          createdAt: { [Op.gt]: TODAY_START, [Op.lt]: NOW },
          moreDetails: { [Op.contains]: { type: 'spinWheel' } }
        },
        group: ['user_id', 'wheelDivisionId'],
        raw: true
      })

      // Transform the result into the desired format
      const wheelDivisionCount = userSpinData.reduce((accumulator, entry) => {
        const { wheelDivisionId, wheelDivisionIdCount } = entry
        accumulator[wheelDivisionId] = wheelDivisionIdCount
        return accumulator
      }, {})

      wheelConfiguration.forEach((wheelData, index) => {
        if (!isNull(wheelData.playerLimit)) {
          if (!wheelData.playerLimit) {
            wheelConfiguration[index].isAllow = false
            return false
          }
          const data = wheelDivisionCount[wheelData.wheelDivisionId]
          if (data && Number(data) >= Number(wheelData.playerLimit)) {
            wheelConfiguration[index].isAllow = false
          }
        }
      })

      return { wheelConfiguration }
    } catch (error) {
      return new APIError(error)
    }
  }
}
