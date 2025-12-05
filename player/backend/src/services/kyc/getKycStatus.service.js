import { KYC_STATUS, KYC_LEVELS } from '@src/utils/constants/public.constants.utils'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { calculateProgress } from '@src/helpers/common.helper'
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }


  },
  required: ['userId']
})
export class GetKycStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }
  async run () {
    const { userId } = this.args
    const { sequelize } = this.context
    const { user, userDocument, documentLabel } = sequelize.models
    try {
      const userData = await user.findByPk(userId, {
        attributes: ['id', 'kycStatus', 'kycLevel', 'kycVerifiedAt', 'kycRejectionReason', 'kycLastActivity']
      })
      if (!userData) return this.addError('UserNotFound', 'User not found')
      const documents = await userDocument.findAll({
        where: { userId },
        include: [{
          model: documentLabel,
          as: 'documentLabel',
          attributes: ['id', 'name', 'description', 'isRequired', 'kycLevel']
        }],
        order: [['createdAt', 'DESC']]
      })
      const requiredDocuments = await documentLabel.findAll({
        where: { kycLevel: userData.kycLevel , isActive: true , isRequired: true},
        order: [['id', 'ASC'], ['name', 'ASC']]
      })
      const progress = await calculateProgress(documents, requiredDocuments, userData.kycLevel)
      const optionalDocuments = await documentLabel.findAll({
        where: { kycLevel: userData.kycLevel , isActive: true , isRequired: false},
        order: [['id', 'ASC'], ['name', 'ASC']]
      })
      // let nextLevelRequirements = null
      // if (userData.kycLevel < KYC_LEVELS.LEVEL_4) {
      //   nextLevelRequirements = await documentLabel.findAll({
      //     where: { kycLevel: userData.kycLevel + 2, isActive: true , isRequired: true },
      //     order: [['id', 'ASC'], ['name', 'ASC']]
      //   })
      // }
      console.log("progressreached",progress)
      return {
        result: {
          kycStatus: userData.kycStatus,
          kycLevel: userData.kycLevel,
          kycVerifiedAt: userData.kycVerifiedAt,
          kycRejectionReason: userData.kycRejectionReason,
          kycLastActivity: userData.kycLastActivity,
          documents,
          progress,
          requiredDocuments,
          optionalDocuments
          // nextLevelRequirements
        }
      }
    } catch (error) {
      return this.addError('GetKycStatusError', error.message)
    }
  }

}
export default GetKycStatusService;
