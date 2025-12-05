import ServiceBase from '../serviceBase'
import db from '../../db/models'
import { trackSokulEvent } from '../../utils/common'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'
import moment from 'moment'

export class SendDepositEventService extends ServiceBase {
  async run () {
    try {
      const { userIds } = this.args
      let whereCondition = {
        status: TRANSACTION_STATUS.SUCCESS,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      }
      if (userIds && userIds.length > 0) {
        whereCondition = { ...whereCondition, actioneeId: userIds }
      }
      const deposits = await db.TransactionBanking.findAll({
        attributes: ['amount', 'isFirstDeposit', 'actioneeEmail', 'createdAt'],
        where: whereCondition,
        include: [{ model: db.User, as: 'transactionUser', attributes: ['email'], required: false }]
      })

      if (!deposits.length) {
        return { success: true, message: 'No users to update.' }
      }

      for (const deposit of deposits) {
        try {
          const sokulData = {
            dt: moment(deposit.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            email: deposit?.transactionUser?.email,
            type: deposit?.isFirstDeposit ? 'ftd' : 'dep',
            amount: deposit?.amount
          }
          const sokulResponse = await trackSokulEvent(sokulData, 'baseEvents')
          console.log('sokul deposit event response', deposit?.actioneeEmail, sokulResponse?.data)
        } catch (error) {
          console.error(`Failed for user ${deposit?.actioneeEmail}:`, error)
        }
      }

      return { success: true, message: 'Users updated successfully.' }
    } catch (error) {
      console.error('Error updating transactions:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
