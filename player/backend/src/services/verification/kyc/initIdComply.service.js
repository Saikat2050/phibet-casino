import { idComply } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import { IDComplyAxios } from '@src/libs/axios/idComply.axios'
import { dayjs } from '@src/libs/dayjs'
import { client } from '@src/libs/redis'
import ServiceBase from '@src/libs/serviceBase'
import { IDCOMPLY_USER_STATUS } from '@src/utils/constants/public.constants.utils'

export class InitIdComplyService extends ServiceBase {
  async run () {
    const { userId } = this.args
    const { user: UserModel } = this.context.sequelize.models
    let data = {}
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await UserModel.findOne({ attributes: ['id', 'kycStatus', 'isActive', 'uniqueId'], where: { id: userId }, transaction })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (!user.isActive) return this.addError('UserInactiveErrorType')

      let token = await client.get(`idComplyKyc:${userId}`)
      token = JSON.parse(token)

      if (token) {
        const tokenStatus = await IDComplyAxios.checkKycStatus(token.token)
        if (tokenStatus.status === IDCOMPLY_USER_STATUS.CREATED || tokenStatus.status === IDCOMPLY_USER_STATUS.ACTIVATED) {
          if (dayjs(tokenStatus.expirationTime).isAfter(dayjs())) {
            return { ...data, url: `${idComply.formBaseUrl}?token=${token.token}&oKey=${token.openKey}`, kycStatus: user.kycStatus }
          }
        } else {
          user.kycStatus = tokenStatus.status.toUpperCase()
          await client.del(`idComplyKyc:${userId}`)

          if (tokenStatus.status === IDCOMPLY_USER_STATUS.COMPLETE) {
            if (!user.isProfile) {
              const userFields = tokenStatus.userFields
              if (userFields?.firstName) user.firstName = userFields?.firstName
              if (userFields?.lastName) user.lastName = userFields?.lastName
              if (userFields?.dobDay) user.dateOfBirth = `${userFields?.dobYear}-${userFields?.dobMonth}-${userFields?.dobDay}`
              user.isUpdateProfile = false
              user.isProfile = true

              const userAddress = await this.context.sequelize.models.address.findOne({
                where: { userId: this.args.userId },
                transaction
              })

              if (userAddress) {
                if (userFields?.address) userAddress.address1 = userFields?.address
                if (userFields?.country) userAddress.countryCode = userFields?.country
                if (userFields?.city) userAddress.city = userFields?.city
                if (userFields?.zip) userAddress.zipCode = userFields?.zip
                await userAddress.save({ transaction })
              } else {
                await this.context.sequelize.models.address.create({
                  address1: userFields?.address,
                  countryCode: userFields?.country,
                  city: userFields?.city,
                  zipCode: userFields?.zip,
                  userId: userId
                }, { transaction })
              }
            }
            await client.del(`idComplyKyc:${userId}`)
          }
          await user.save({ transaction })
          await transaction.commit()
        }
      }

      if (user?.kycStatus === IDCOMPLY_USER_STATUS.PROCESSING.toUpperCase()) return this.addError('IdComplyPendingErrorType')
      if (user?.kycStatus === IDCOMPLY_USER_STATUS.COMPLETE.toUpperCase()) return this.addError('IdComplyAlreadyVerifiedErrorType')

      if (user.kycStatus !== IDCOMPLY_USER_STATUS.COMPLETE.toUpperCase()) {
        const result = await IDComplyAxios.createToken(user?.uniqueId)

        const updatedExpirationTime = dayjs(result.expirationTime).add(5, 'minute')
        const expiry = Math.ceil((new Date(updatedExpirationTime.format()) - new Date()) / 1000)

        await client.set(
          `idComplyKyc:${userId}`,
          JSON.stringify({
            token: result.token,
            openKey: result.openKey,
            expirationTime: result.expirationTime
          }),
          'EX',
          expiry
        )
        data = { ...data, url: result?.hostedFormLink, kycStatus: user.kycStatus }
      }

      return { ...data }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
