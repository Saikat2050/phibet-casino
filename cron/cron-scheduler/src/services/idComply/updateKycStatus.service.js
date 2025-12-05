import { sequelize } from '@src/database'
import { IDComplyAxios } from '@src/libs/axios/idComply.axios'
import { Logger } from '@src/libs/logger'
import { pubSubRedisClient } from '@src/libs/pubSubRedisClient'
import { ServiceBase } from '@src/libs/serviceBase'
import { IDCOMPLY_USER_STATUS } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

export class UpdateKycStatusService extends ServiceBase {
  async run () {
    const { user: UserModel } = sequelize.models

    try {
      const keys = await pubSubRedisClient.client.keys('idComplyKyc*')

      const keysDetails = await Promise.all(keys.map(async (key) => {
        const value = await pubSubRedisClient.client.get(key)
        return { key, value: JSON.parse(value) }
      }))
      const kycStatusResponses = await Promise.all(keysDetails.map(detail => IDComplyAxios.checkKycStatus(detail.value.token)))
      const kycCompletedUsers = { idComplyStatus: {}, users: [] }

      const userIds = kycStatusResponses.reduce((acc, cur) => {
        if (Object.values(IDCOMPLY_USER_STATUS).includes(cur.status)) {
          if (cur.status === IDCOMPLY_USER_STATUS.COMPLETE) {
            kycCompletedUsers.idComplyStatus = { ...kycCompletedUsers.idComplyStatus, [cur.userId]: cur }
          }
          return {
            ...acc,
            [cur.status]: [...acc[cur.status], cur.userId]
          }
        } else { return acc }
      }, Object.values(IDCOMPLY_USER_STATUS).reduce((acc, cur) => ({ ...acc, [cur]: [] }), {}))

      const statusArray = Object.entries(userIds)
      await Promise.all(
        statusArray.map((user) => {
          if (user[1].length > 0 && user[0] !== 'complete') {
            return UserModel.update({ kycStatus: user[0].toUpperCase() }, { where: { uniqueId: { [Op.in]: user[1] } } })
          } else {
            if (user[0] === 'complete') kycCompletedUsers.users = user[1]
            return true
          }
        })
      )

      if (kycCompletedUsers.users.length) {
        const allKycCompletedUsersDetails = await UserModel.findAll({ where: { uniqueId: { [Op.in]: kycCompletedUsers.users } } })
        await Promise.all(
          allKycCompletedUsersDetails?.map(user => {
            const data1 = kycCompletedUsers.idComplyStatus[user.uniqueId]
            if (!user.isProfile) {
              const data = {
                kycStatus: 'COMPLETE',
                dateOfBirth: `${data1?.userFields?.dobYear}-${data1?.userFields?.dobMonth}-${data1?.userFields?.dobDay}`,
                firstName: data1?.userFields?.firstName,
                lastName: data1?.userFields?.lastName,
                isProfile: true,
                isUpdateProfile: false
              }
              return UserModel.update({ ...data }, { where: { id: user.id } })
            } else {
              return UserModel.update({ kycStatus: 'COMPLETE' }, { where: { id: user.id } })
            }
          })
        )
      }

      const deleteRedisStatus = ['complete', 'failed', 'archived']
      await Promise.all(
        statusArray.map((user) => {
          if (user[1].length > 0 && deleteRedisStatus.includes(user[0])) {
            return user[1].map(i => pubSubRedisClient.client.del(`idComplyKyc:${i}`))
          } else {
            return true
          }
        })
      )

      return { success: true, userIds }
    } catch (error) {
      Logger.error(`Error in IDComply Check KYC status Service: ${error}`)
      return { success: false, message: 'Error in Expire Bonus Service', data: null, error }
    }
  }
}
