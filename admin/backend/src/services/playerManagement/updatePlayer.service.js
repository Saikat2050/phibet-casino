import { APIError } from '@src/errors/api.error'
import { idComplyProfileDataVerification } from '@src/helpers/idComply.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { emitLogOut } from '@src/socket-resources/emitters/logout.emitter'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { USER_GENDER } from '@src/utils/constants/public.constants.utils'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    phoneCode: { type: 'string' },
    gender: { enum: Object.values(USER_GENDER) },
    dateOfBirth: { type: 'string' },
    username: { type: 'string', default: '' },
    countryCode: { type: 'string' },
    stateCode: { type: 'string' },
    city: { type: 'string' },
    zipCode: { type: 'string' },
    address1: { type: 'string' },
    address2: { type: ['string', 'null'] },
    adminUserId: { type: 'string' },
    isIdComply: { type: 'boolean', default: false }
  },
  required: ['userId']
})

export class UpdatePlayerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const firstName = this.args.firstName
    const lastName = this.args.lastName
    const email = this.args.email
    const phone = this.args.phone
    const phoneCode = this.args.phoneCode
    const gender = this.args.gender
    const dateOfBirth = this.args.dateOfBirth
    const username = this.args.username
    const countryCode = this.args?.countryCode || 'US'
    const stateCode = this.args.stateCode
    const city = this.args.city
    const zipCode = this.args.zipCode
    const address1 = this.args.address1
    const address2 = this.args?.address2 || ''
    const transaction = this.context.sequelizeTransaction
    const isIdComply = this.args.isIdComply

    try {
      const player = await this.context.sequelize.models.user.findOne({ where: { id: this.args.userId }, transaction })
      if (!player) return this.addError('UserDoesNotExistsErrorType')

      const previousData = player.get({ plain: true })

      if (email) {
        const userCount = await this.context.sequelize.models.user.count({ col: 'id', where: { email }, transaction })
        if (!userCount && player.email !== email) {
          player.email = email
          player.emailVerified = false
          emitLogOut(player.id, { logout: true })
        }
      }

      if (username) {
        const userCount = await this.context.sequelize.models.user.count({ col: 'id', where: { username }, transaction })
        if (!userCount) player.username = username
      }

      if (phone && player.phone !== phone) {
        player.phone = phone || player.phone
        player.phoneVerified = false
      }

      player.phoneCode = phoneCode || player.phoneCode
      player.firstName = firstName || player.firstName
      player.lastName = lastName || player.lastName
      player.gender = gender || player.gender
      player.dateOfBirth = dateOfBirth || player.dateOfBirth
      player.username = username || player.username
      player.isProfile = true

      await player.save({ transaction })
      const address = await this.context.sequelize.models.address.findOne({
        where: { userId: this.args.userId },
        transaction
      })
      if (countryCode || city || zipCode || stateCode || address1 || address2) {
        if (!address) await this.context.sequelize.models.address.create({ address1, address2, countryCode, city, zipCode, userId: player.id, stateCode }, { transaction })
        else await this.context.sequelize.models.address.update({ address1, address2, countryCode, city, zipCode, stateCode }, { where: { userId: this.args.userId }, transaction })
      }

      if (isIdComply) {
        const checkIDCompliance = await idComplyProfileDataVerification({
          userId: player.uniqueId,
          firstName: this.args.firstName ?? player.firstName,
          lastName: this.args.lastName ?? player.lastName,
          dobYear: new Date(player.dateOfBirth).getFullYear().toString(),
          dobMonth: (new Date(player.dateOfBirth).getMonth() + 1).toString(),
          dobDay: new Date(player.dateOfBirth).getDate().toString(),
          state: stateCode ?? address?.stateCode,
          city: city ?? address?.city,
          streetAddress: address1 ?? address?.address1,
          zip: zipCode ?? address?.zipCode,
          country: 'US'
        })

        if (!checkIDCompliance.match && checkIDCompliance.errors) {
          if (checkIDCompliance.hardStop) return this.addError('UserFoundMortalityOrHardstoppedErrorType')
          return this.addError('UserDetailsNotMachingWithIdErrorType')
        }
      }

      const modifiedData = (await this.context.sequelize.models.user.findOne({ where: { id: this.args.userId } })).get({ plain: true })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: player?.id,
        entityType: 'user',
        action: 'update',
        changeTableId: player?.id,
        changeTableName: 'users',
        previousData: { player: previousData },
        modifiedData: { player: modifiedData },
        service: 'updatePlayer',
        category: tableCategoriesMapping.users,
        moreDetails: { changeTableName: 'address', changeTableId: player?.id }
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
