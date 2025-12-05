import socketServer from '../../libs/socketServer'
import ServiceBase from '../serviceBase'
import { round, plus, divide, times, minus } from 'number-precision'
import { Op } from 'sequelize'
export class ApplyPromocodeService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { Package: PackageModel, Promocode: PromocodeModel, UserActivities: UserActivitiesModel, PromoCodeUser: PromoCodeUserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId, promocode, flag } = this.args

    try {
      let packageDetail = await PackageModel.findOne({
        attributes: ['amount', 'packageId', 'gcCoin', 'scCoin'],
        where: { packageId },
        raw: true,
        transaction
      })
      if (!packageDetail) return this.addError('NotFound')

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
      console.log("promocodeExist==============", promocodeExist)
      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      let completePackageDetail = {
        promocodeId: promocodeExist.promocodeId,
        maxUsersAvailed: promocodeExist.maxUsersAvailed === null ? promocodeExist.maxUsersAvailed : +promocodeExist.maxUsersAvailed,
        promocode,
        beforeDiscountAmount: packageDetail.amount,
        beforeDiscountGcCoin: packageDetail.gcCoin,
        beforeDiscountScCoin: packageDetail.scCoin
      }

      if (promocodeExist.package && !promocodeExist.package.includes(+packageId)) return this.addError('PromocodeNotApplicableErrorType')

      if (promocodeExist.maxUsersAvailed !== null && +promocodeExist.maxUsersAvailed === 0) {
        return this.addError('PromocodeAvailedLimitReachedErrorType')
      }

      if (!promocodeExist.isPromoCodeForAllUsers) {
        const promoCodeUsers = await PromoCodeUserModel.findOne({
          where: {
            promoCodeId: promocodeExist.promocodeId,
            userId: user.userId
          }
        })
        if (!promoCodeUsers) {
          return this.addError('PromoCodeNotEligibleErrorType')
        }
      }

      if (+promocodeExist.perUserLimit !== 0) {
        const isPurchaseActive = await socketServer.redisClient.get(`promocodeCount:${promocodeExist.promocodeId}:${user.userId}`) || 0
        const promocodeCount = await UserActivitiesModel.count({
          where: { userId: user.userId, promocodeId: promocodeExist.promocodeId },
          transaction
        })
        if (+plus(+promocodeCount, +isPurchaseActive) >= +promocodeExist.perUserLimit) {
          return this.addError('PromocodePerUserLimitReachedErrorType')
        }
        if (+promocodeCount >= +promocodeExist.perUserLimit) {
          return this.addError('PromocodePerUserLimitReachedErrorType')
        }
        if (flag) await socketServer.redisClient.set(`promocodeCount:${promocodeExist.promocodeId}:${user.userId}`, +plus(+isPurchaseActive, 1), 'EX', 60 * 15)
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
      return this.addError('InternalServerErrorType', error)
    }
  }
}
