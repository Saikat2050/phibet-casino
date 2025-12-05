import ServiceBase from '../../serviceBase'
import { round, times, divide, plus } from 'number-precision'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetVaultDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        GlobalSetting: GlobalSettingModel
      }
    } = this.context

    try {
      const {
        req: {
          user: { detail: userDetail }
        }
      } = this.context

      const userWallet = await WalletModel.findOne({
        attributes: {
          exclude: [
            'non_cash_amount',
            'amount',
            'ownerId',
            'createdAt',
            'updatedAt'
          ]
        },
        where: { ownerId: userDetail.userId }
      })
      if (!userWallet) return this.addError('UserNotExistsErrorType')

      const [{ value: MAX_SC_VAULT_PER }, { value: MAX_GC_VAULT_PER }] =
        await GlobalSettingModel.findAll({
          attributes: ['key', 'value'],
          where: {
            key: ['MAX_SC_VAULT_PER', 'MAX_GC_VAULT_PER']
          },
          raw: true
        })

      const totalScCoin = +userWallet.totalScCoin
      const { bsc, psc, wsc } = userWallet.vaultScCoin
      const totalVaultScCoin = +round(+plus(bsc, psc, wsc), 2)
      const MaxGcDepositLimit = +round(+divide(+times(+MAX_GC_VAULT_PER, +userWallet.gcCoin), 100), 2) || 0
      const MaxScDepositLimit = +round(+divide(+times(+MAX_SC_VAULT_PER, +userWallet.totalScCoin), 100), 2) || 0
      const MaxGcWithdrawLimit = +round(+divide(+times(+MAX_GC_VAULT_PER, +userWallet.vaultGcCoin), 100), 2) || 0
      const MaxScWithdrawLimit = +round(+divide(+times(+MAX_SC_VAULT_PER, +totalVaultScCoin), 100), 2) || 0

      const userVaultDetails = {
        ...userWallet.dataValues,
        maxGcAllowForDeposit: MaxGcDepositLimit,
        maxScAllowForDeposit: MaxScDepositLimit,
        maxGcAllowForWithdraw: MaxGcWithdrawLimit,
        maxScAllowForWithdraw: MaxScWithdrawLimit,
        totalWalletScCoin: totalScCoin,
        totalVaultScCoin,
        authEnable: userDetail.authEnable || false
      }

      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        data: userVaultDetails
      }
    } catch (error) {
      console.log('Error Occur in GetVaultDetailService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
