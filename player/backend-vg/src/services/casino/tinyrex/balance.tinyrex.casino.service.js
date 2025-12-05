import { round } from 'number-precision'
import { scSum } from '../../../utils/common'
import ServiceBase from '../../serviceBase'
export class TinyrexBalanceService extends ServiceBase {
  async run () {
    const { userBalance, detail, currencyCode } = this.args
    try {
      const accountBalance = currencyCode === 'SC' ? scSum(detail.userWallet) : +round(userBalance, 2)
      return { balance: accountBalance }
    } catch (error) {
      return {
        status: 'ERROR',
        code: 'GENERAL_ERROR',
        statusCode: 503,
        message: 'Please contact casino for this with the initial request.'
      }
    }
  }
}
