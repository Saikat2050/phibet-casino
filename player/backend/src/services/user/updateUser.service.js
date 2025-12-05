import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import { idComplyProfileDataVerification } from '@src/helpers/idComply.helper'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { IDCOMPLY_PROFILE_SEND_DATA_LIMIT, IDCOMPLY_USER_STATUS, USER_GENDER } from '@src/utils/constants/public.constants.utils'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    phone: { type: 'string' },
    username: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneCode: { type: 'string' },
    dateOfBirth: { type: 'string' },
    password: { type: 'string' },
    gender: { enum: [...Object.values(USER_GENDER), 'other'] },
    address1: { type: 'string' },
    address2: { type: ['string', 'null'] },
    city: { type: 'string' },
    zipCode: { type: 'string' },
    stateCode: { type: 'string' }
  },
  required: ['userId']
})

export class UpdateUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const userModel = this.context.sequelize.models.user

      const user = await userModel.findOne({ where: { id: this.args.userId }, transaction })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      const idComplyLimitCount = user.moreDetails?.idComplyCount || 0
      const moreDetails = user.moreDetails ? user.moreDetails : {}
      if (idComplyLimitCount >= IDCOMPLY_PROFILE_SEND_DATA_LIMIT && !user.isProfile) return { errors: [{ message: 'Verification failed. Please contact support for manual verification.', isUpdateProfile: false }] }

      if (!user.isUpdateProfile) return { success: true }
      const password = this.args.password
      if (password) {
        const encryptedPassword = await bcrypt.hash(password, appConfig.bcrypt.salt)
        user.password = encryptedPassword
      }

      user.gender = (this.args.gender === 'other') ? USER_GENDER.UNKNOWN : this.args.gender ?? user.gender
      user.lastName = this.args.lastName ?? user.lastName
      user.firstName = this.args.firstName ?? user.firstName
      user.dateOfBirth = this.args.dateOfBirth ?? user.dateOfBirth

      const username = this.args.username
      if (username) {
        const usernameExists = await userModel.findOne({ where: { username, id: { [Op.ne]: user.id } }, transaction })
        if (usernameExists) return this.addError('UsernameIsTakenErrorType')

        user.username = username
      }


      const { phone, phoneCode } = this.args
      if (phone && phoneCode) {
        const isSameAsCurrent =
          user.phone === phone && user.phoneCode === phoneCode

        if (!isSameAsCurrent) {
          const phoneExists = await userModel.findOne({
            where: {
              phone,
              phoneCode,
              id: { [Op.ne]: user.id }
            },
            transaction
          })

          if (phoneExists) {
            return this.addError('PhoneIsTakenErrorType')
          }

          user.phone = phone
          user.phoneCode = phoneCode
        }
      }

      let userAddress = await this.context.sequelize.models.address.findOne({
        where: {
          userId: this.args.userId
        },
        transaction
      })

      if (this.args.city && this.args.zipCode && this.args.stateCode) {
        if (!userAddress) {
          userAddress = await this.context.sequelize.models.address.create({
            address1: this.args.address1,
            address2: this.args.address2,
            countryCode: this.args.countryCode,
            city: this.args.city,
            zipCode: this.args.zipCode,
            stateCode: this.args.stateCode,
            userId: this.args.userId
          },
          { transaction }
          )
        } else {
          const countryCode = this.args.countryCode
          const city = this.args.city
          const zipCode = this.args.zipCode
          const stateCode = this.args.stateCode
          const addressField1 = this.args.address1
          const addressField2 = this.args?.address2 || ''
          if (countryCode) userAddress.countryCode = countryCode
          if (city) userAddress.city = city
          if (zipCode) userAddress.zipCode = zipCode
          if (stateCode) userAddress.stateCode = stateCode
          if (addressField1) userAddress.address1 = addressField1
          userAddress.address2 = addressField2
        }
      }


      user.moreDetails = { ...user.moreDetails, idComplyCount: idComplyLimitCount + 1 }
      user.isProfile = true
      await userAddress.save({ transaction })
      await user.save({ transaction })
      user.dataValues.userAddress = userAddress

      return { user }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
