import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 }
  },
  required: ['id']
})

export class GetPackageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.args

    try {
      // Fetch the package by ID
      const sweepPackage = await this.context.sequelize.models.package.findOne({
        where: { id },
        attributes: { exclude: ['updatedAt', 'createdAt'] }
      })

      // Handle case where package is not found
      if (!sweepPackage) return this.addError('PackageNotFoundErrorType')

      return { sweepPackage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
