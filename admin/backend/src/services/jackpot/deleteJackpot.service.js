import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { JACKPOT_STATUS, SUCCESS_MSG } from '@src/utils/constants/app.constants'

export class DeleteJackpotService extends ServiceBase {
  async run () {
    const {
      sequelizeTransaction: transaction
    } = this.context

    try {
      const { jackpotId } = this.args

      const checkJackpotId = await this.context.sequelize.models.jackpot.findOne({ where: { jackpotId, status: JACKPOT_STATUS.UPCOMING }, transaction })

      if (!checkJackpotId) return this.addError('JackpotNotUpcomingErrorType')

      await checkJackpotId.destroy({ where: { jackpotId }, transaction })

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
