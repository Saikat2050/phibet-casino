import { ServiceBase } from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { Op } from 'sequelize'
import { isDateValid } from '@src/helpers/common.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    promocode: { type: 'string' },
    isActive: { type: 'boolean', enum: [true, false] },
    validFrom: { type: ['string', 'null'] },
    validTill: { type: ['string', 'null'] },
    maxUsersAvailed: { type: ['number', 'null'] },
    perUserLimit: { type: 'number' },
    isDiscountOnAmount: { type: 'boolean', enum: [true, false] },
    discountPercentage: { type: 'number' },
    packages: { type: 'array', items: { type: 'number' } }
  },
  required: ['promocode', 'isActive', 'discountPercentage', 'perUserLimit']
})

export class CreatePromoCodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { promocode, isActive, validFrom, validTill, maxUsersAvailed, perUserLimit, isDiscountOnAmount, discountPercentage, packages } = this.args
    const transaction = this.context.sequelizeTransaction
    const { promocode: promoCodeModel, package: packageModel } = this.context.sequelize.models

    try {
      const promoCodeExist = await promoCodeModel.findOne({
        where: { promocode: promocode }
      })

      if (promoCodeExist) return this.addError('PromoCodeAlreadyExistErrorType')

      if (isDiscountOnAmount) {
        if (discountPercentage > 99 || discountPercentage <= 0) return this.addError('InvalidPercentangeValueErrorType')
      } else {
        if (discountPercentage > 100 || discountPercentage <= 0) return this.addError('InvalidPercentangeValueErrorType')
      }

      let query = { promocode, isActive, discountPercentage, perUserLimit, isDiscountOnAmount }

      if (validFrom && !isDateValid(validFrom)) return this.addError('InvalidDateErrorType')
      if (validFrom) {
        validFrom = new Date(validFrom)
        query = { ...query, validFrom }
      }

      if (validTill && !isDateValid(validTill)) return this.addError('InvalidDateErrorType')
      if (validTill) {
        validTill = new Date(validTill)
        query = { ...query, validTill }
      }

      if (maxUsersAvailed) query = { ...query, maxUsersAvailed }

      let where

      if (packages && packages.length) {
        where = {
          id: {
            [Op.in]: packages
          },
          isActive: true
        }
      } else {
        where = {
          isActive: true
        }
      }

      const packageIds = (
        await packageModel.findAll({
          where: where,
          attributes: ['id', 'isActive']
        })
      ).map(packageData => {
        return packageData.id
      })

      query = { ...query, package: packageIds }

      await promoCodeModel.create(query, { transaction })

      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
