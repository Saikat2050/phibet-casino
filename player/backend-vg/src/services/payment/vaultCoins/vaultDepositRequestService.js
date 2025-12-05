import { plus, round, times, divide, minus } from 'number-precision'
import moment from 'moment'
import ServiceBase from '../../serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { AMOUNT_TYPE, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'
import { Verify2FAOtpService } from '../../2fa/verify2faOtp.service'
import { trackEvent } from '../../../utils/common'

export class VaultDepositRequestService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Wallet: WalletModel,
        GlobalSetting: GlobalSettingModel,
        User: UserModel,
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
          attributes: ['authEnable', 'authUrl', 'affiliateCode'],
          required: true
        }]
      })
      if (!userWallet) return this.addError('UserNotExistsErrorType')
      const { User: user } = userWallet
      let result
      if (user.authEnable) {
        if (!token) return this.addError('EnabledTwoFaTokenMustBeRequiredErrorType')
        result = await Verify2FAOtpService.run({ token, password, callService: 'vaultDeposit' }, this.context)
        if (result.error) {
          return this.addError(result.message)
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
      const MaxGcDepositLimit = +round(+divide(+times(+MAX_GC_VAULT_PER, +userWallet.gcCoin), 100), 2) || 0
      const MaxScDepositLimit = +round(+divide(+times(+MAX_SC_VAULT_PER, +userWallet.totalScCoin), 100), 2) || 0
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
        if (+amount > +MaxGcDepositLimit) return this.addError('YouCannotDepositMoreThanAllowedGcLimitErrorType')
        userWallet.gcCoin = +round(minus(+userWallet.gcCoin, +amount), 2)
        userWallet.vaultGcCoin = +round(+plus(+userWallet.vaultGcCoin, +amount), 2)
        transactionDetails = {
          ...transactionDetails,
          amountType: AMOUNT_TYPE.GC_COIN,
          transactionType: TRANSACTION_TYPE.VAULT_DEPOSIT,
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
        if (+amount > +MaxScDepositLimit) return this.addError('YouCannotDepositMoreThanAllowedScLimitErrorType')
        if (+amount > +(userWallet.scCoin.bsc + userWallet.scCoin.psc + userWallet.scCoin.wsc)) return this.addError('InsufficientScBalanceErrorType')
        let remainingAmount = 0
        if (+userWallet.scCoin.bsc >= +amount) {
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +round(+minus(+userWallet.scCoin.bsc, +amount), 2)
          }
          userWallet.vaultScCoin = {
            ...userWallet.vaultScCoin,
            bsc: +round(+plus(+userWallet.vaultScCoin.bsc, +amount), 2)
          }
          balanceObj = {
            ...balanceObj,
            afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
            afterGcBalance: +round((+userWallet.gcCoin || 0), 2)
          }
        } else {
          remainingAmount = +round(+minus(+amount, +userWallet.scCoin.bsc), 2)
          userWallet.vaultScCoin = {
            ...userWallet.vaultScCoin,
            bsc: +round(+plus(+userWallet.vaultScCoin.bsc, +userWallet.scCoin.bsc), 2)
          }
          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: 0
          }
          if (+userWallet.scCoin.psc >= +remainingAmount) {
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: +round(+minus(+userWallet.scCoin.psc, +remainingAmount), 2)
            }
            userWallet.vaultScCoin = {
              ...userWallet.vaultScCoin,
              psc: +round(+plus(+userWallet.vaultScCoin.psc, +remainingAmount), 2)
            }
            balanceObj = {
              ...balanceObj,
              afterScBalance: +round(((+userWallet.scCoin.bsc || 0) + (userWallet.scCoin.psc || 0) + (userWallet.scCoin.wsc || 0)), 2),
              afterGcBalance: +round((+userWallet.gcCoin || 0), 2)
            }
          } else {
            remainingAmount = +round(+minus(+remainingAmount, +userWallet.scCoin.psc), 2)
            userWallet.vaultScCoin = {
              ...userWallet.vaultScCoin,
              psc: +round(+plus(+userWallet.vaultScCoin.psc, +userWallet.scCoin.psc), 2)
            }
            userWallet.scCoin = {
              ...userWallet.scCoin,
              psc: 0
            }
            if (+userWallet.scCoin.wsc < +remainingAmount) return this.addError('InsufficientScBalanceErrorType')
            userWallet.scCoin = {
              ...userWallet.scCoin,
              wsc: +round(+minus(+userWallet.scCoin.wsc, +remainingAmount), 2)
            }
            userWallet.vaultScCoin = {
              ...userWallet.vaultScCoin,
              wsc: +round(+plus(+userWallet.vaultScCoin.wsc, +remainingAmount), 2)
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
          transactionType: TRANSACTION_TYPE.VAULT_DEPOSIT,
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

      if (transactionDetails.status === TRANSACTION_STATUS.SUCCESS) {
        const isFirstDeposit = await TransactionBankingModel.findOne({
          where: {
            actioneeId: +transactionDetails.actioneeId,
            transactionType: TRANSACTION_TYPE.DEPOSIT,
            isSuccess: true
          },
          raw: true,
          transaction
        })
        if (user && user.affiliateCode) {
          const affiliate = user.affiliateCode.replaceAll('-', '')
          const scalioData = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: isFirstDeposit ? 'ftd' : 'dep',
            click_id: affiliate,
            adv_user_id: userWallet?.ownerId,
            amount: isFirstDeposit ? isFirstDeposit.amount : transactionDetails?.amount,
            currency: transactionDetails?.currencyCode || 'USD',
            event_id: transactionDetails?.casinoTransactionId
          }
          await trackEvent(scalioData)
        }
      }

      await transaction.commit()
      WalletEmitter.emitUserWalletBalance({ scCoin: balanceObj.afterScBalance + '', gcCoin: balanceObj.afterGcBalance + '' }, userDetail.userId)
      return { success: true, message: SUCCESS_MSG.DEPOSIT_SUCCESS }
    } catch (error) {
      await transaction.rollback()
      console.log('Error Occur in VaultDepositRequestService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
