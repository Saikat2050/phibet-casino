import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    id: {
      type: ['string', 'null']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class PromoCodeAppliedDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // const {
    //   dbModels: { Promocode: PromocodeModel, UserActivities, User: UserModel, package: PackageModel }
    // } = this.context
    const { promocode: promoCodeModel, package: packageModel, userActivity: userActivityModel } = this.context.sequelize.models
    const UserModel = this.context.sequelize.models.user

    const { id, pageNo, limit } = this.args

    const { page, size } = pageValidation(pageNo, limit)

    try {
      const promocodeExist = await promoCodeModel.findOne({
        where: { id: id },
        attributes: ['id', 'promocode', 'isActive', 'validTill', 'package']
      })

      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      const packageDetails = []
      if (promocodeExist.package) {
        for (const packageId of promocodeExist.package) {
          const detail = await packageModel.findOne({
            where: { id: packageId },
            attributes: ['id', 'amount', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore', 'validTill'],
            raw: true
          })

          packageDetails.push(detail)
        }
      }
      const appliedDetailsRaw = await userActivityModel.findAndCountAll({
        where: { promocodeId: id, activityType: 'PROMO_CODE_APPLIED' },
        attributes: ['createdAt', 'userId'],
        limit: size,
        offset: (page - 1) * size,
        order: [['createdAt', 'DESC']]
      })

      const appliedDetails = await Promise.all(
        appliedDetailsRaw.rows.map(async (activity) => {
          // Fetch user details for each activity
          const user = await UserModel.findOne({
            where: { id: activity.userId },
            attributes: ['id', 'email', 'username', 'isActive', 'firstName', 'lastName'],
            raw: true
          })
          return {
            ...activity.get(),
            user
          }
        })
      )

      return {
        success: true,
        promocodeExist,
        packageDetails,
        appliedDetails: {
          count: appliedDetailsRaw.count,
          rows: appliedDetails
        },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
