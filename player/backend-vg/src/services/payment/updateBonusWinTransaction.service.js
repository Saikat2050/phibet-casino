import ServiceBase from '../serviceBase'
import db, { sequelize } from '../../db/models'
import { trackSokulEvent } from '../../utils/common'
import moment from 'moment'
import { Op } from 'sequelize'
import { mappedStates } from '../../configs/states'
export class UpdateBonusWinTransactionService extends ServiceBase {
  async run () {
    try {
      const { userIds, actionType, status } = this.args
      const playerIds = JSON.parse(userIds)
      let users
      let whereCondition = {}

      if (actionType === 'updateUser' && playerIds.length <= 0) {
        whereCondition = {}
      } else if (actionType === 'baseEventRegistration' && playerIds.length <= 0) {
        whereCondition = {
          [Op.or]: [
            { isEmailVerified: true },
            { signInMethod: { [Op.in]: ['1', '2', '3'] } }
          ]
        }
      } else {
        whereCondition = { userId: playerIds }
      }
      if (actionType === 'registration' && playerIds.length <= 0) {
        users = await db.User.findAll({
          attributes: ['createdAt', 'email', 'firstName', 'lastName', 'moreDetails', 'userId', 'isEmailVerified'],
          where: sequelize.where(
            sequelize.fn('jsonb_extract_path_text', sequelize.col('more_details'), 'sokulResponseId'),
            null
          )
        })
      } else {
        users = await db.User.findAll({
          attributes: ['createdAt', 'email', 'firstName', 'lastName', 'moreDetails', 'userId', 'isEmailVerified', 'phone', 'dateOfBirth', 'gender', 'isActive', 'state', 'title', 'isBan'],
          where: whereCondition,
          include: [{ model: db.ResponsibleGambling, as: 'responsibleGambling', attributes: ['status', 'selfExclusion', 'responsibleGamblingType', 'timeBreakDuration', 'permanentSelfExcluded'], required: false }]
        })
      }

      if (!users.length) {
        return { success: true, message: 'No users to update.' }
      }

      for (const user of users) {
        try {
          if (actionType === 'registration') {
            const sokulData = {
              dt: moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
              email: user.email,
              first_name: user.firstName || '',
              last_name: user.lastName || ''
            }

            const sokulResponse = await trackSokulEvent(sokulData, 'registration', user?.isEmailVerified)

            if (sokulResponse?.status === 200) {
              const updatedMoreDetails = {
                ...user.moreDetails,
                sokulResponseId: sokulResponse?.data,
                userSokulRegPayload: sokulData
              }

              await user.update({ moreDetails: updatedMoreDetails })
            }
          } else if (actionType === 'baseEventRegistration') {
            const sokulData = {
              dt: moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
              email: user.email,
              type: 'reg',
              amount: 0.0
            }

            const sokulResponse = await trackSokulEvent(sokulData, 'baseEventsRegistration')
            console.log('sokul base event registration', user.email, sokulResponse?.data)
          } else if (actionType === 'updateUser') {
            let isSelfExcluded = false
            const rsg = user?.responsibleGambling[user?.responsibleGambling?.length - 1]
            if ((rsg && rsg?.selfExclusion && (rsg?.permanentSelfExcluded || moment(rsg?.timeBreakDuration) > moment())) || (rsg && rsg?.timeBreakDuration && new Date(rsg?.timeBreakDuration) > new Date())) isSelfExcluded = true
            let sokulData = {
              email: user?.email,
              first_name: user?.firstName || '',
              last_name: user?.lastName || '',
              phone: user?.phone || '',
              gender: user?.gender || '',
              title: user?.title || '',
              state: user?.state ? mappedStates[user?.state] : '',
              status: status || ((user?.isBan || !user?.isActive || isSelfExcluded) ? 'other' : 'active')
            }
            if (user?.dateOfBirth) {
              sokulData = { ...sokulData, birth: user?.dateOfBirth }
            }
            const sokulResponse = await trackSokulEvent(sokulData, 'updateUser')
            console.log('sokul update user', user.email, sokulResponse?.data)
          }
        } catch (error) {
          console.error(`Failed for user ${user.userId}:`, error)
        }
      }

      return { success: true, message: 'Users updated successfully.' }
    } catch (error) {
      console.error('Error updating transactions:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
