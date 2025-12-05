import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    amount: { type: 'number' },
    searchString: { type: 'string' },
    operator: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  }
})

export class GetPackagesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { page, perPage, searchString, amount, operator } = this.args

      const where = {
        isActive: true,
        welcomePackage: false,
        isVisibleInStore: true,
        [Op.and]: {
          validFrom: { [Op.lte]: `${(new Date(Date.now())).toISOString().substring(0, 10)} 00:00:00.000+00` },
          validTill: { [Op.gte]: `${(new Date(Date.now())).toISOString().substring(0, 10)} 23:59:59.999+00` }
        }
      }
      if (searchString) where.lable = { [Op.iLike]: `%${searchString}%` }

      if (amount) {
        const operatorMapping = {
          '>': Op.gte,
          '<': Op.lte,
          '=': Op.eq
        }

        const sequelizeOperator = operatorMapping[operator]
        if (sequelizeOperator) {
          where.amount = { [sequelizeOperator]: amount }
        }
      }

      const { count, rows } = await this.context.sequelize.models.package.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        where,
        order: [['amount', 'asc']],
        limit: perPage,
        offset: (page - 1) * perPage
      })

      const updatedRows = []

      if (rows?.length) {
        let orderByOrderId = true
        for (const row of rows) {
          if (row.discountEndDate && ((new Date(row.discountEndDate)) < (new Date()))) {
            row.discountAmount = null
            row.discountEndDate = null
          }

          const purchaseNumber = await this.context.sequelize.models.transaction.count({
            col: 'id',
            where: { packageId: row.id, status: TRANSACTION_STATUS.COMPLETED }
          })

          if (!purchaseNumber || !row.packagePurchaseNumber || (+purchaseNumber < +row.packagePurchaseNumber)) {
            if (!row.orderId) orderByOrderId = false
            row.amountAfterDiscount = (row.discountAmount) ? (row.amount - row.discountAmount) : row.amount
            updatedRows.push(row)
          }
        }

        if (orderByOrderId) updatedRows.sort((a, b) => a.orderId - b.orderId)
        else updatedRows.sort((a, b) => a.amountAfterDiscount - b.amountAfterDiscount)
      }

      return { packages: updatedRows, page, totalPages: Math.ceil(count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
