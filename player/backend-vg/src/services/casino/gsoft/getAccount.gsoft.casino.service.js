import Logger from '../../../libs/logger'
import ServiceBase from '../../serviceBase'
import {
  TECHNICAL_ERROR,
  userVerificationAndDetails
} from './helper.gsoft.casino'

export class GetAccountGSoftCasinoService extends ServiceBase {
  async run () {
    const { gamesessionid, accountid: accountId, apiversion } = this.args

    try {
      const { userData, currency, accountBalance } =
        await userVerificationAndDetails(
          {
            sessionId: gamesessionid,
            accountId: accountId,
            apiVersion: apiversion
          },
          this.context.sequelizeTransaction
        )

      return {
        code: 200,
        status: 'Success',
        accountid: accountId,
        city: userData.city ?? 'Los Angles',
        country: userData.country ?? 'US',
        currency,
        gamesessionid,
        real_balance: accountBalance,
        bonus_balance: 0.0,
        apiversion
      }
    } catch (error) {
      await this.context.sequelizeTransaction.rollback()
      console.log('error', error)
      if (error.code) return error
      Logger.error('GSoft Account Service Error', error)
      return TECHNICAL_ERROR(apiversion)
    }
  }
}
