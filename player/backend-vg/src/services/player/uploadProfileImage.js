import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { uploadFile, uploadFiles } from '../../utils/uploadFiles'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { s3 } from '../../libs/aws-s3'

/**
 * Provides service for file uploading
 * @export
 * @class UploadProfileImage
 * @extends {ServiceBase}
 */
const s3Config = config.getProperties().s3

export default class UploadProfileImage extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user },
        files
      },
      dbModels: {
        User: UserModel
      },
      sequelizeTransaction
    } = this.context

    try {
      const element = {}

      if (user?.profileImage) {
        const deleteParams = {
          Bucket: s3Config.bucket,
          Key: user.profileImage
        }
        await s3.deleteObject(deleteParams).promise()
      }

      const profileImageValidate = validateFile(null, files)
      if (profileImageValidate !== OK) {
        return this.addError(`${profileImageValidate}`)
      }

      const uploadedFiles = await uploadFiles(files, user)

      await UserModel.update({
        profileImage: uploadedFiles[0].key
      }, {
        where: {
          userId: user.userId
        },
        transaction: sequelizeTransaction
      })

      return {
        status: 200,
        message: SUCCESS_MSG.UPLOAD_SUCCESS,
        profileImage: uploadedFiles[0]?.documentUrl
      }
    } catch (error) {
      console.log(error)
      return this.addError('FileUploadFailedErrorType')
    }
  }
}
