import ServiceBase from '@src/libs/serviceBase'
import { round, plus, divide, times, minus } from 'number-precision'
import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import { getCachedData, setData } from '@src/helpers/redis.helper'

const schema = {
  type: 'object',
  properties: {
    packageId: { anyOf: [{ type: 'number' }, { type: 'string' }] },
    promocode: { type: 'string' },
    flag: { type: ['boolean', 'null'] },
    userId: { anyOf: [{ type: 'number' }, { type: 'string' }] }

  },
  required: ['packageId', 'promocode', 'userId']
}

const constraints = ajv.compile(schema)
export class ApplyPromocodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { package: PackageModel, promocode: PromocodeModel, userActivity: userActivityModel } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction
    const { packageId, promocode, flag, userId } = this.args
    try {
      let packageDetail = await PackageModel.findOne({
        attributes: ['amount', 'id', 'gcCoin', 'scCoin'],
        where: { id: packageId },
        raw: true,
        transaction
      })
      if (!packageDetail) return this.addError('PackageNotFoundErrorType')

      const promocodeExist = await PromocodeModel.findOne({
        where: {
          promocode: promocode.trim(),
          isActive: true,
          [Op.or]: [
            { validTill: { [Op.gte]: new Date(Date.now()) } },
            { validTill: { [Op.is]: null } }
          ]
        },
        raw: true
      })

      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      let completePackageDetail = {
        promocodeId: promocodeExist.id,
        maxUsersAvailed: promocodeExist.maxUsersAvailed === null ? promocodeExist.maxUsersAvailed : +promocodeExist.maxUsersAvailed,
        promocode,
        beforeDiscountAmount: packageDetail.amount,
        beforeDiscountGcCoin: packageDetail.gcCoin,
        beforeDiscountScCoin: packageDetail.scCoin
      }

      if (promocodeExist.package && !promocodeExist.package.includes(+packageId)) {
        return this.addError('PromocodeNotApplicableErrorType')
      }

      if (promocodeExist.maxUsersAvailed !== null && +promocodeExist.maxUsersAvailed === 0) {
        return this.addError('PromocodeAvailedLimitReachedErrorType')
      }

      if (+promocodeExist.perUserLimit !== 0) {
        const cacheKey = `promocodeCount:${promocodeExist.id}:${userId}`
        const isPurchaseActive = await getCachedData(cacheKey) || 0

        // Get all promocode keys for this user
        // const promocodeKeys = await Promise.all([
        //   getCachedData(`promocodeCount:${promocodeExist.id}:${userId}`),
        //   getCachedData(`promocodeCount:${promocodeExist.id}`),
        //   getCachedData(`promocode:${promocodeExist.id}`)
        // ])

        // console.log('Promocode related keys:', {
        //   userSpecific: promocodeKeys[0],
        //   promocodeCount: promocodeKeys[1],
        //   promocodeDetails: promocodeKeys[2]
        // })
        // await removeData(cacheKey)
        // console.log('Promocode related keys:', {
        //   userSpecific: promocodeKeys[0],
        //   promocodeCount: promocodeKeys[1],
        //   promocodeDetails: promocodeKeys[2]
        // })
        const promocodeCount = await userActivityModel.count({
          where: { userId: String(userId), promocodeId: promocodeExist.id },
          transaction
        })

        if (+plus(+promocodeCount, +isPurchaseActive) >= +promocodeExist.perUserLimit) {
          return this.addError('PromocodePerUserLimitReachedErrorType')
        }
        if (+promocodeCount >= +promocodeExist.perUserLimit) {
          return this.addError('PromocodePerUserLimitReachedErrorType')
        }
        if (flag) {
          await setData(cacheKey, +plus(+isPurchaseActive, 1), 60 * 15)
        }
      }

      let updatedAmount, updatedSc, updatedGc, discountedAmount, discountedSc, discountedGC

      if (promocodeExist.isDiscountOnAmount) {
        discountedAmount = +round(+divide(+times(+packageDetail.amount, +promocodeExist.discountPercentage), 100), 2)
        completePackageDetail = { ...completePackageDetail, discountPercentage: +promocodeExist.discountPercentage, discountedAmount }

        updatedAmount = +minus(+packageDetail.amount, +round(+divide(+times(+packageDetail.amount, +promocodeExist.discountPercentage), 100), 2))
        packageDetail = { ...packageDetail, amount: updatedAmount }
      } else {
        discountedSc = +round(+divide(+times(+packageDetail.scCoin, +promocodeExist.discountPercentage), 100), 2)
        discountedGC = +round(+divide(+times(+packageDetail.gcCoin, +promocodeExist.discountPercentage), 100), 2)
        completePackageDetail = { ...completePackageDetail, discountPercentage: +promocodeExist.discountPercentage, discountedSc, discountedGC }

        updatedSc = +plus(+packageDetail.scCoin, +round(+divide(+times(+packageDetail.scCoin, +promocodeExist.discountPercentage), 100), 2))
        updatedGc = +plus(+packageDetail.gcCoin, +round(+divide(+times(+packageDetail.gcCoin, +promocodeExist.discountPercentage), 100), 2))
        packageDetail = { ...packageDetail, gcCoin: updatedGc, scCoin: updatedSc }
      }

      completePackageDetail = {
        ...completePackageDetail,
        afterDiscountAmount: packageDetail.amount,
        afterDiscountGcCoin: packageDetail.gcCoin,
        afterDiscountScCoin: packageDetail.scCoin
      }

      if (flag) {
        return { packageData: packageDetail, completePackageDetail }
      }

      return completePackageDetail
    } catch (error) {
      return this.addError('InternalServerErrorType', error.message || 'An internal server error occurred')
    }
  }
}
