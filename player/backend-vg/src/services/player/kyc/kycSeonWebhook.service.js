import ServiceBase from '../../serviceBase'
import { KYC_STATUS, SOKUL_KYC_STATUS } from '../../../utils/constants/constant'
import KycCompletedStatusEmitter from '../../../socket-resources/emitter/kycStatusEmitter.emitter'
import { trackSokulEvent } from '../../../utils/common'

export class KycSeonWebhookService extends ServiceBase {
  async run() {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { details } =
      this.args
    try {
      const externalUserId = details.userId
      console.log('?????????????????????????????????', this.args)
      let update = {}

      const user = await UserModel.findOne({
        attributes: ['userId', 'kycStatus', 'phoneVerified', 'email'],
        where: {
          userId: +externalUserId
        },
        transaction
      })

      if (!user) {
        return {
          success: false,
          message: `User external ID is not correct : ${externalUserId}!!`
        }
      }

      if (details.status === 'APPROVED') {
        update = {
          ...update,
          kycApplicantId: details.referenceId,
          kycStatus: KYC_STATUS.APPROVED
          // sumsubKycStatus: 'completed'
        }
        trackSokulEvent({ email: user?.email, kyc_status: SOKUL_KYC_STATUS.ACCOUNT_FULLY_VERIFIED }, 'updateUser')
      } else {
        update = {
          ...update,
          kycApplicantId: details.referenceId,
          kycStatus: KYC_STATUS[details.status]
          // sumsubKycStatus: 'onHold'
        }
        trackSokulEvent({ email: user?.email, kyc_status: SOKUL_KYC_STATUS[details.status] }, 'updateUser')
      }

      await UserModel.update(update, {
        where: {
          userId: externalUserId
        },
        transaction
      })

      KycCompletedStatusEmitter.emitKycStatus(update, externalUserId)

      return 'ok'
    } catch (error) {
      console.log('errrrrrrrrrrrr', error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
