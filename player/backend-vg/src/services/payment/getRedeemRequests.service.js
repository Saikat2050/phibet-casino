import { Op } from 'sequelize'
import moment from 'moment'
import ajv from '../../libs/ajv'
import ServiceBase from '../serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { DATE_FORMAT, TRANSACTION_STATUS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    page: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['pending', 'success', 'failed', 'cancelled', 'inprogress', 'all']
    }
  }
}

const constraints = ajv.compile(schema)

export class GetRedeemRequestsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { WithdrawRequest: WithdrawRequestModel } = this.context.dbModels
      const { userId } = this.context.req.user.detail
      const { limit, page, startDate, status } = this.args
      let { endDate } = this.args

      const { pageNo, size } = pageValidation(page, limit)

      let query = { userId }

      if (moment(startDate) > moment(endDate)) return this.addError('InvalidDateErrorType')
      endDate = moment(endDate).add(1, 'days').format(DATE_FORMAT)

      if (startDate && endDate) {
        query = { ...query, createdAt: { [Op.between]: [moment(startDate).format(DATE_FORMAT), moment(endDate).format(DATE_FORMAT)] } }
      }

      if (status && status !== 'all') query = { ...query, status: TRANSACTION_STATUS[status.toUpperCase()] }
      else query = { ...query, status: { [Op.ne]: TRANSACTION_STATUS.PUSHCASH } }
      const myTransactions = await WithdrawRequestModel.findAndCountAll({
        attributes: ['transactionId', 'createdAt', 'amount', 'status', 'actionableEmail', 'updatedAt'],
        where: query,
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: ((pageNo - 1) * size)
      })

      return { data: myTransactions || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
