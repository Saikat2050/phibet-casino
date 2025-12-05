import Logger from '../../../libs/logger'
import ServiceBase from '../../serviceBase'
import { TECHNICAL_ERROR, userVerificationAndDetails } from './helper.gsoft.casino'

export class GetBalanceGSoftCasinoService extends ServiceBase {
  async run () {
    const { accountid, apiversion, gamesessionid } = this.args

    try {
      const { accountBalance } = await userVerificationAndDetails(
        {
          sessionId: gamesessionid,
          accountId: accountid,
          apiVersion: apiversion
        },
        this.context.sequelizeTransaction
      )

      return {
        code: 200,
        status: 'Success',
        balance: +accountBalance,
        real_balance: +accountBalance,
        bonus_balance: 0.00,
        apiversion
      }
    } catch (error) {
      await this.context.sequelizeTransaction.rollback()
      console.log(error)
      if (error.code) return error
      Logger.error('GSoft Balance Service Error', error)
      return TECHNICAL_ERROR(apiversion)
    }
  }
}
