import { Op } from 'sequelize'
import ServiceBase from '../serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import socketServer from '../../libs/socketServer'

export class GetAllPaymentProviderService extends ServiceBase {
  async run () {
    try {
      const {
        dbModels: { PaymentProvider: PaymentProviderModel },
      } = this.context

      const {
        search,
        depositAllowed,
        withdrawAllowed,
        orderBy = 'paymentProviderName',
        sort = 'ASC'
      } = this.args

      const isUnfilteredRequest =
        !search && !depositAllowed && !withdrawAllowed

      if (isUnfilteredRequest) {
        const cachedData = await socketServer.redisClient.get('paymentprovider')
        if (Array.isArray(cachedData) && cachedData.length > 0) {
          return {
            success: true,
            message: SUCCESS_MSG.GET_SUCCESS,
            result: JSON.parse(cachedData)
          }
        }
      }

      const query = {}

      if (typeof depositAllowed !== 'undefined' && depositAllowed !== 'all') {
        query.depositAllowed = depositAllowed
      }

      if (typeof withdrawAllowed !== 'undefined' && withdrawAllowed !== 'all') {
        query.withdrawAllowed = withdrawAllowed
      }

      if (search) {
        query.paymentProviderName = {
          [Op.iLike]: `%${search.trim()}%`
        }
      }

      query.isArchived = false
      const options = {
        where: query,
        order: [[orderBy, sort.toUpperCase()]]
      }

      const paymentProviders = await PaymentProviderModel.findAll(options)
      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        result: paymentProviders
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
