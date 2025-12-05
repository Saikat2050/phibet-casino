import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { KYC_STATUS, SHUFTI_KYC_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({ type: 'object' })

export class UpdateKycStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { reference, event, ...payload } = this.args

    const userModel = this.context.sequelize.models.user
    const transaction = this.context.sequelizeTransaction
    let status = KYC_STATUS.PENDING

    try {
      const userDetails = await userModel.findOne({
        where: { uniqueId: reference.split('_')[0] },
        attributes: ['id', 'kycStatus', 'moreDetails'],
        transaction
      })

      if (event === SHUFTI_KYC_STATUS.IN_PROGRESS) status = KYC_STATUS.IN_PROGRESS
      else if (event === SHUFTI_KYC_STATUS.COMPLETED) status = KYC_STATUS.COMPLETED
      else if (event === SHUFTI_KYC_STATUS.FAILED) status = KYC_STATUS.FAILED

      if (status !== KYC_STATUS.PENDING) await userDetails.set({ kycStatus: status, moreDetails: { ...userDetails.moreDetails, kycData: payload || {} } }).save({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
