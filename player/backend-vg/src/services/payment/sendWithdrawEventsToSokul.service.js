import ServiceBase from '../serviceBase'
import db from '../../db/models'
import { trackSokulEvent } from '../../utils/common'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'
import moment from 'moment'

export class SendWithdrawEventService extends ServiceBase {
  async run () {
    try {
      const { userIds } = this.args
      let whereCondition = {
        status: TRANSACTION_STATUS.SUCCESS
      }
      if (userIds && userIds.length > 0) {
        whereCondition = { ...whereCondition, userId: userIds }
      }
      const withdraws = await db.WithdrawRequest.findAll({
        attributes: ['amount', 'email', 'createdAt'],
        where: whereCondition,
        include: [{ model: db.User, attributes: ['email'], required: false }]
      })

      if (!withdraws.length) {
        return { success: true, message: 'No users to update.' }
      }

      for (const withdraw of withdraws) {
        try {
          const sokulData = {
            dt: moment(withdraw.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            email: withdraw?.User?.email,
            type: 'wdr',
            amount: withdraw?.amount
          }
          console.log(sokulData)
          const sokulResponse = await trackSokulEvent(sokulData, 'baseEvents')
          console.log('sokul deposit event response', withdraw?.email, sokulResponse?.data)
        } catch (error) {
          console.error(`Failed for user ${withdraw?.email}:`, error)
        }
      }

      return { success: true, message: 'Users updated successfully.' }
    } catch (error) {
      console.error('Error updating transactions:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
