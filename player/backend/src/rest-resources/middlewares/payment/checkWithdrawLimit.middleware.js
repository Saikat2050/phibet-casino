import { sequelize } from '@src/database/models'
import { errorTypes } from '@src/utils/constants/error.constants'
/**
 * @type {import('express').RequestHandler}
 */
export async function checkWithdrawLimit (req, _, next) {
  try {
    const { providerId, walletId, amount } = req.body
    const wallet = await sequelize.models.wallet.findOne({
      where: { id: walletId },
      attributes: ['currencyId', 'userId']
    })
    if (!wallet) return next(errorTypes.InvalidWalletIdErrorType)
    const paymentProvider = await sequelize.models.paymentProvider.findOne({
      where: { id: providerId },
      attributes: ['withdrawAllowed'],
      include: {
        model: sequelize.models.providerLimit,
        where: { currencyId: wallet.currencyId },
        attributes: ['minWithdraw', 'maxWithdraw']
      }
    })

    if (!paymentProvider?.withdrawAllowed) return next(errorTypes.WithdrawNotAllowedErrorType)
    if (paymentProvider?.providerLimits[0].maxWithdraw < amount) return next(errorTypes.MaximumWithdrawLimitErrorType)
    if (paymentProvider?.providerLimits[0].minWithdraw > amount) return next(errorTypes.MinimumWithdrawLimitErrorType)
    req.body.wallet = wallet
    next()
  } catch (error) {
    next(error)
  }
}
