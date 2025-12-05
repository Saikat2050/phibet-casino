import countryCodesToCountries from '@src/database/models/countryCodesToCountries.json'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    countryCode: { enum: Object.keys(countryCodesToCountries) },
    city: { type: 'string' },
    zipCode: { type: 'string' },
    address: { type: 'string' }
  },
  required: ['userId', 'countryCode', 'city', 'zipCode', 'address']
})

export class AddAddressService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction
      const user = await this.context.sequelize.models.user.findOne({ attributes: ['id', 'emailVerified'], where: { id: this.args.userId }, transaction })
      if (!user.emailVerified) return this.addError('EmailNotVerifiedErrorType')

      const country = await this.context.sequelize.models.country.findOne({ attributes: ['id'], where: { code: this.args.countryCode } })
      user.countryId = country.id
      await user.save(await user.save({ transaction }))

      const address = await this.context.sequelize.models.address.create({
        userId: user.id,
        countryCode: this.args.countryCode,
        city: this.args.city,
        zipCode: this.args.zipCode,
        address: this.args.address
      }, { transaction })

      return address
    } catch (error) {
      throw new APIError(error)
    }
  }
}
