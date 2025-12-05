import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import ServiceBase from '@src/libs/serviceBase'
import { CURRENCY_TYPES, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    userId: { type: 'string' },
    currencyId: { type: 'string' },
    coinType: { type: 'string' },
    purpose: { type: ['string', 'null'], enum: [...Object.values(LEDGER_PURPOSE), 'all'] },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10, minimum: 10 },
    status: { type: ['string', 'null'], enum: ['pending', 'completed', 'all'] }
  },
  required: ['userId']
})

export class GetTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const endDate = this.args.endDate
    const startDate = this.args.startDate
    const purpose = this.args.purpose
    const userId = this.args.userId
    const coinType = this.args.coinType
    const status = this.args.status
    const { transaction, ledger, currency } = this.context.sequelize.models
    try {
      const ledgerWhere = { purpose: { [Op.in]: ['RedeemFailed', 'RedeemRejected', 'Purchase', 'PurchaseGcCoin', 'PurchaseScCoin', 'PurchaseGcBonus', 'PurchaseScBonus', 'Redeem', 'ReferralDeposit', 'BonusCashed', 'BonusDeposit', 'AddCoin', 'RemoveCoin', 'VipTierWeeklyBonus', 'VipTierMonthlyBonus', 'VipTierTierUpBonus', 'VipTierRakebackBonus', 'DAILY_BONUS', 'JOINING_BONUS', 'spinWheelSc', 'spinWheelGc'] } }
      const currencyWhere = { type: { [Op.in]: [CURRENCY_TYPES.GOLD_COIN, CURRENCY_TYPES.SWEEP_COIN] } }
      const where = { userId }

      if (purpose !== 'all' && purpose) {
        if (purpose === LEDGER_PURPOSE.PURCHASE) ledgerWhere.purpose = { [Op.in]: [LEDGER_PURPOSE.PURCHASE_GC_COIN, LEDGER_PURPOSE.PURCHASE_GC_BONUS, LEDGER_PURPOSE.PURCHASE_SC_BONUS, LEDGER_PURPOSE.PURCHASE_SC_COIN] }
        else ledgerWhere.purpose = purpose
      }
      if (coinType && coinType !== 'all') currencyWhere.type = coinType

      if (startDate || endDate) {
        const start = startDate ? dayjs(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '1970-01-01 00:00:00'
        const end = endDate ? dayjs(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '9999-12-31 23:59:59'
        where.createdAt = { [Op.between]: [start, end] }
      }
      if (status && status !== 'all') where.status = status

      const totalCount = await this.context.sequelize.models.transaction.count({
        where,
        distinct: true, // ensures COUNT(DISTINCT("transaction"."id"))
        col: 'id',      // column to apply DISTINCT on
        include: [
          {
            as: 'transactionLedger',
            model: this.context.sequelize.models.ledger,
            where: {
              ...ledgerWhere,
            },
            required: true
          }
        ],
      })

      const rows = await transaction.findAll({
        attributes: { exclude: ['updatedAt'] },
        where,
        include: [
          {
            as: 'transactionLedger',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: ledger,
            where: ledgerWhere,
            required: false,
            include: [
              {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                model: currency,
                where: currencyWhere,
                required: true
              }
            ]
          }
        ],
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']],
      })

      return { transactions: rows, totalPages: Math.ceil(totalCount / perPage), page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
