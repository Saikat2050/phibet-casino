import { plus, round, times, divide, minus } from 'number-precision'
import moment from 'moment'
import ServiceBase from '../../serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { AMOUNT_TYPE, ROLE, SIGN_IN_METHOD, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'
import { Verify2FAOtpService } from '../../2fa/verify2faOtp.service'
import { comparePassword, trackEvent } from '../../../utils/common'

export class VaultWithdrawRequestService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        User: UserModel,
        GlobalSetting: GlobalSettingModel,
        Country: CountryModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const { coinType, amount, token = null, password = null } = this.args
      const { detail: userDetail } = this.context.req.user
      const userId = userDetail.userId
      if (+amount <= 0) return this.addError('InvalidAmountErrorType')
      const userWallet = await WalletModel.findOne({
        where: { ownerId: userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction,
        include: [{
          model: UserModel,
          attributes: ['authEnable', 'authUrl', 'password', 'signInMethod'],
          required: true
        }]
      })
      if (!userWallet) return this.addError('UserNotExistsErrorType')
      const { bsc, psc, wsc } = userWallet.vaultScCoin
      const totalVaultScCoin = +round(+plus(bsc, psc, wsc), 2)
      const { User: user } = userWallet
      let result
      if (user.authEnable) {
        if (!token) return this.addError('EnabledTwoFaTokenMustBeRequiredErrorType')
        if ((user.signInMethod === SIGN_IN_METHOD.NORMAL) && (!password)) return this.addError('PasswordMustBeRequiredErrorType')
        result = await Verify2FAOtpService.run({ token, password, callService: 'vaultWithdraw' }, this.context)
        if (result.error) {
          return this.addError(result.message)
        }
      } else if (user.signInMethod === SIGN_IN_METHOD.NORMAL) {
        if (!password) return this.addError('PasswordMustBeRequiredErrorType')
        if (!(await comparePassword(password, user.password))) {
          return this.addError('IncorrectPasswordErrorType')
        }
      }
      const [{ value: MAX_SC_VAULT_PER }, { value: MAX_GC_VAULT_PER }] = await GlobalSettingModel.findAll({
        attributes: ['key', 'value'],
        where: {
          key: ['MAX_SC_VAULT_PER', 'MAX_GC_VAULT_PER']
        },
        raw: true
      })
      if (!((+MAX_SC_VAULT_PER <= 100) && (+MAX_GC_VAULT_PER <= 100))) return this.addError('PercentageValueShouldNotBeMoreThan100ErrorType')
      const MaxGcWithdrawLimit = +round(+divide(+times(+MAX_GC_VAULT_PER, +userWallet.vaultGcCoin), 100), 2) || 0
      const MaxScWithdrawLimit = +round(+divide(+times(+MAX_SC_VAULT_PER, +totalVaultScCoin), 100), 2) || 0
      const beforeBalance = {
        gcCoin: userWallet.gcCoin,
        scCoin: userWallet.scCoin
      }
      let balanceObj = {
        beforeScBalance:
          (userWallet.scCoin.bsc || 0) +
          (userWallet.scCoin.psc || 0) +
          (userWallet.scCoin.wsc || 0),
        beforeGcBalance: userWallet.gcCoin
      }
      let name = userDetail.firstName
      if (userDetail.lastName) name = name + ' ' + userDetail.lastName
      const userCountry = await CountryModel.findOne({
        attributes: ['code'],
        where: { countryId: userDetail?.countryCode },
        raw: true
      })
      let transactionDetails = {
        actioneeType: ROLE.USER,
        actioneeId: userDetail?.userId,
        actioneeEmail: userDetail?.email,
        actioneeName: name,
        walletId: userWallet?.walletId,
        amount: 0,
        currencyCode: userWallet?.currencyCode || 'USD',
        countryCode: userCountry?.code || 'US',
        beforeBalance: beforeBalance,
        primaryCurrencyAmount: 0,
        adminId: userDetail?.parentId,
        status: TRANSACTION_STATUS.SUCCESS,
        transactionDateTime: new Date().toISOString(),
        isSuccess: true
      }

      // 1) check this amount user has or not  as well as their max cointype limit
      if (coinType === 'gc' && +amount > 0) {
        // check global percenatge
        if (+amount > +MaxGcWithdrawLimit) return this.addError('YouCannotWithdrawMoreThanAllowedGcLimitErrorType')
        if (+amount > +userWallet.vaultGcCoin) return this.addError('InsufficientBalanceErrorType')
        userWallet.vaultGcCoin = +round(+minus(+userWallet.vaultGcCoin, +amount), 2)
        userWallet.gcCoin = +round(+plus(+userWallet.gcCoin, +amount), 2)
        transactionDetails = {
          ...transactionDetails,
          amountType: AMOUNT_TYPE.GC_COIN,
          transactionType: TRANSACTION_TYPE.VAULT_WITHDRAW,
          gcCoin: amount,
          scCoin: 0,
          afterBalance: {
            gcCoin: userWallet.gcCoin,
            scCoin: userWallet.scCoin
          }
        }
        balanceObj = {
          ...balanceObj,
          afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
          afterGcBalance: +round((+userWallet.gcCoin || 0), 2)
        }
      } else if (coinType === 'sc' && +amount > 0) {
        if (+amount > +MaxScWithdrawLimit) return this.addError('YouCannotWithdrawMoreThanAllowedScLimitErrorType')
        if (+amount > +(userWallet.vaultScCoin.bsc + userWallet.vaultScCoin.psc + userWallet.vaultScCoin.wsc)) return this.addError('InsufficientScBalanceErrorType')
        let remainingAmount = 0
        if (+userWallet.vaultScCoin.bsc >= +amount) {
          userWallet.vaultScCoin = {
            ...userWallet.vaultScCoin,
            bsc: +round(+minus(+userWallet.vaultScCoin.bsc, +amount), 2)
          }
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +round(+plus(+userWallet.scCoin.bsc, +amount), 2)
          }
          balanceObj = {
            ...balanceObj,
            afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
            afterGcBalance: +round((+userWallet.gcCoin || 0), 2)
          }
        } else {
          remainingAmount = +round(+minus(+amount, +userWallet.vaultScCoin.bsc), 2)
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +round(+plus(+userWallet.scCoin.bsc, +userWallet.vaultScCoin.bsc), 2)
          }
          userWallet.vaultScCoin = {
            ...userWallet.vaultScCoin,
            bsc: 0
          }
          if (+userWallet.vaultScCoin.psc >= +remainingAmount) {
            userWallet.vaultScCoin = {
              ...userWallet.vaultScCoin,
              psc: +round(+minus(+userWallet.vaultScCoin.psc, +remainingAmount), 2)
            }
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: +round(+plus(+userWallet.scCoin.psc, +remainingAmount), 2)
            }
            balanceObj = {
              ...balanceObj,
              afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
              afterGcBalance: +round((+userWallet.gcCoin || 0), 2)
            }
          } else {
            remainingAmount = +round(+minus(+remainingAmount, +userWallet.vaultScCoin.psc), 2)
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: +round(+plus(+userWallet.scCoin.psc, +userWallet.vaultScCoin.psc), 2)
            }
            userWallet.vaultScCoin = {
              ...userWallet.vaultScCoin,
              psc: 0
            }
            if (+userWallet.vaultScCoin.wsc < +remainingAmount) return this.addError('InsufficientBalanceErrorType')
            userWallet.vaultScCoin = {
              ...userWallet.vaultScCoin,
              wsc: +round(+minus(+userWallet.vaultScCoin.wsc, +remainingAmount), 2)
            }
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +round(+plus(+userWallet.scCoin.wsc, +remainingAmount), 2)
            }
            balanceObj = {
              ...balanceObj,
              afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
              afterGcBalance: +round((+userWallet.gcCoin || 0), 2)
            }
          }
        }
        transactionDetails = {
          ...transactionDetails,
          amountType: AMOUNT_TYPE.SC_COIN,
          transactionType: TRANSACTION_TYPE.VAULT_WITHDRAW,
          scCoin: amount,
          gcCoin: 0,
          afterBalance: {
            gcCoin: userWallet.gcCoin,
            scCoin: userWallet.scCoin
          }
        }
      }
      await userWallet.save({ transaction })
      await TransactionBankingModel.create(transactionDetails, {
        transaction
      })
      if (transactionDetails.status === TRANSACTION_STATUS.SUCCESS && userDetail?.affiliateCode) {
        const affiliate = userDetail.affiliateId.replaceAll('-', '')
        const scalioData = {
          timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          type: 'wdr',
          click_id: affiliate,
          adv_user_id: userWallet?.ownerId,
          amount: transactionDetails?.amount,
          currency: transactionDetails?.currencyCode || 'USD',
          event_id: transactionDetails?.casinoTransactionId
        }
        try {
          const trackingResponse = await trackEvent(scalioData)
          if (trackingResponse.code === 200) {
            return true
          } else {
            console.error('Tracking event error:', trackingResponse)
            return false
          }
        } catch (error) {
          console.error('Error in tracking response:', error)
          return false
        }
      }
      await transaction.commit()
      WalletEmitter.emitUserWalletBalance({ scCoin: balanceObj.afterScBalance + '', gcCoin: balanceObj.afterGcBalance + '' }, userDetail.userId)
      return { success: true, message: SUCCESS_MSG.WITHDRAW_SUCCESS }
    } catch (error) {
      await transaction.rollback()
      console.log('Error Occur in VaultWithdrawRequestService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
