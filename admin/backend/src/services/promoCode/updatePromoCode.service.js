import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { isDateValid } from '@src/helpers/common.helper'

const schema = {
  type: 'object',
  properties: {
    promocode: { type: 'string' },
    isActive: { type: 'boolean', enum: [true, false] },
    validTill: { type: ['string', 'null'] },
    validFrom: { type: ['string', 'null'] },
    maxUsersAvailed: { type: ['number', 'null'] },
    perUserLimit: { type: 'number' },
    isDiscountOnAmount: { type: 'boolean', enum: [true, false] },
    discountPercentage: { type: 'number' },
    packages: { type: ['array', 'null'], items: { type: 'number' } },
    id: { type: 'number' },
    isArchived: { type: 'boolean', enum: [true, false] }
  },
  required: ['id', 'promocode']
}
const constraints = ajv.compile(schema)
export class UpdatePromoCodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { promocode: promoCodeModel, package: packageModel, userActivity: userActivityModel } = this.context.sequelize.models

    let { id, promocode, isActive, validFrom, validTill, maxUsersAvailed, perUserLimit, isDiscountOnAmount, discountPercentage, packages } = this.args

    try {
      const promocodeExist = await promoCodeModel.findOne({
        where: { id: id }
      })

      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      // Check for duplicate promocode name (excluding current id)
      if (promocode) {
        const duplicatePromo = await promoCodeModel.findOne({
          where: {
            promocode: promocode,
            id: { [Op.ne]: id }
          }
        })
        if (duplicatePromo) return this.addError('DuplicatePromoCodeNameErrorType')
      }

      const updateObj = { promocode }

      if (isActive || isActive !== '') updateObj.isActive = isActive

      if (typeof this.args.isArchived === 'boolean') {
        if (this.args.isArchived === false) {
          updateObj.isArchived = false
          updateObj.deletedAt = null
        } else if (this.args.isArchived === true) {
          updateObj.isArchived = true
          updateObj.deletedAt = new Date()
          updateObj.isActive = false
        }
      }

      if (validFrom && !isDateValid(validFrom)) return this.addError('InvalidDateErrorType')
      if (validFrom) {
        validFrom = new Date(validFrom)
        updateObj.validFrom = validFrom
      }

      if (validTill && !isDateValid(validTill)) return this.addError('InvalidDateErrorType')
      if (validTill) {
        validTill = new Date(validTill)
        updateObj.validTill = validTill
      }

      if (maxUsersAvailed !== '') {
        const alreadyClaimedCount = await userActivityModel.count({
          where: { id: id },
          transaction
        })
        if (alreadyClaimedCount && alreadyClaimedCount > maxUsersAvailed && maxUsersAvailed !== null) return this.addError('UsersAlreadyAppliedPromocodeErrorType')
        updateObj.maxUsersAvailed = maxUsersAvailed
      }
      if (perUserLimit !== '') updateObj.perUserLimit = perUserLimit

      if (isDiscountOnAmount) {
        if (discountPercentage > 99 || discountPercentage <= 0) return this.addError('InvalidPercentageValueErrorType')
        updateObj.discountPercentage = discountPercentage
        updateObj.isDiscountOnAmount = isDiscountOnAmount
      } else {
        if (discountPercentage > 100 || discountPercentage <= 0) return this.addError('InvalidPercentageValueErrorType')
        updateObj.discountPercentage = discountPercentage
        updateObj.isDiscountOnAmount = isDiscountOnAmount
      }

      if (packages && packages.length) {
        const packageIds = (
          await packageModel.findAll({
            where: {
              id: {
                [Op.in]: packages
              },
              isActive: true
            },
            attributes: ['id', 'isActive']
          })
        ).map(packageData => {
          return packageData.id
        })

        updateObj.package = packageIds
      }

      await promoCodeModel.update(updateObj, { where: { id: id }, transaction })

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
