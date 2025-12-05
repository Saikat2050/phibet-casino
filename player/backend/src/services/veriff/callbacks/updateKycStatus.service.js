import { APIError } from '@src/errors/api.error'
import { createSignature } from '@src/helpers/veriff.encryption.helper'
import ajv from '@src/libs/ajv'
import { VeriffAxios } from '@src/libs/axios/veriff.axios'
import ServiceBase from '@src/libs/serviceBase'
import { VERIFF_STATUS } from '@src/utils/constants/app.constants'
import { DOCUMENT_STATUS_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({ type: 'object' })

export class UpdateKycStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userModel = this.context.sequelize.models.user
    const documentModel = this.context.sequelize.models.document
    const transaction = this.context.sequelizeTransaction

    const { ...payload } = this.args

    let newDocumentsList, query
    const veriffId = payload?.verification?.id || payload?.id

    try {
      const userDetails = await userModel.findOne({
        where: { veriffApplicantId: payload?.verification?.id || payload?.id },
        attributes: ['id', 'veriffApplicantId', 'email', 'firstName', 'lastName', 'moreDetails']
      })

      if (payload?.action === 'submitted') {
        const data = await VeriffAxios.getVeriffDocuments(veriffId)
        newDocumentsList = data?.images
      }

      if (newDocumentsList) {
        const uniqueDocs = {}
        const documentLabel = await this.context.sequelize.models.documentLabel.findOne({ attributes: ['id', 'name'], where: { name: 'Veriff' } })

        for (const document of newDocumentsList) {
          const keyValue = document.name
          if (!uniqueDocs[keyValue]) {
            uniqueDocs[keyValue] = true
            await documentModel.create({
              userId: userDetails.id,
              documentName: document.name,
              url: document.url,
              signature: createSignature({ payload: document.id }),
              documentLabelId: documentLabel.id,
              veriffApplicantId: veriffId
            })
          }
        }
        query = { veriffApplicantId: veriffId, veriffStatus: DOCUMENT_STATUS_TYPES.REQUESTED }
      }

      if (payload?.verification?.id && payload.status) {
        query = { veriffStatus: payload.verification.status }
        if (payload.verification.status === VERIFF_STATUS.APPROVED) {
          await documentModel.update({
            status: DOCUMENT_STATUS_TYPES.APPROVED
          }, {
            where: { userId: userDetails?.id, veriffApplicantId: veriffId },
            transaction
          })
        } else if (payload.verification.status === VERIFF_STATUS.DECLINED) {
          await documentModel.update({
            status: DOCUMENT_STATUS_TYPES.REJECTED,
            comment: payload?.verification?.reason
          }, {
            where: { userId: userDetails.id, veriffApplicantId: veriffId },
            transaction
          })
        }
      }

      if (query) {
        await userModel.update({
          ...query,
          moreDetails: {
            ...userDetails.moreDetails,
            veriffReason: payload?.verification?.reason
          }
        }, {
          where: { id: userDetails.id },
          transaction
        })
      }
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
