import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getOne, updateEntity } from '../../utils/crud'
import { uploadFiles } from '../../utils/uploadFiles'
import { prepareImageUrl, validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
      // pattern: '^[a-zA-Z0-9]*$'
    }
  }
}

const constraints = ajv.compile(schema)

export class UpdateSelfProfileService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req:
      {
        body: {
          username
        },
        user: {
          detail: user
        },
        files
      },
      dbModels: {
        UserDocument: UserDocumentModel,
        User: UserModel,
        Wallet: WalletModel,
        GlobalSetting: SettingsModel
      },
      sequelizeTransaction: t
    } = this.context
    const userUpdate = {}
    const userData = await getOne({
      model: UserModel,
      data: { uniqueId: user?.uniqueId, userId: user?.userId }
    })
    if (!userData) {
      return this.addError('UserNotExistsErrorType')
    }
    if (username && userData?.username !== username) {
      const usernameExist = await getOne({
        model: UserModel,
        data: { username: username.trim() }
      })
      if (usernameExist) {
        return this.addError('UserNameExistErrorType')
      } else {
        userUpdate.username = username.trim()
      }
    }
    if (files.length > 0) {
      const fileCheckResponse = validateFile(null, files)
      if (fileCheckResponse !== OK) {
        return this.addError(`${fileCheckResponse}`)
      }
      const uploadedFile = await uploadFiles(files, user)
      if (uploadedFile === 'DocumentUploadError') {
        return this.addError('DocumentUploadError')
      }
      if (uploadedFile) {
        for (const document of uploadedFile) {
          if (document.documentName === 'userProfile') {
            userUpdate.profileImage = document.key
          }
        }
      }
    }
    await updateEntity({
      model: UserModel,
      values: { userId: user.userId },
      data: { ...userUpdate },
      transaction: t
    })

    const userProfile = await getOne({
      model: UserModel,
      data: { uniqueId: user.uniqueId, userId: user.userId },
      include: [
        { model: WalletModel, as: 'userWallet', attributes: ['totalScCoin', 'walletId', 'amount', 'currencyCode', 'ownerType', 'ownerId', 'non_cash_amount', 'gcCoin', 'scCoin'] },
        { model: UserDocumentModel, as: 'userDocuments', attributes: ['userDocumentId', 'documentName', 'documentUrl'] }
      ],
      transaction: t
    })

    const [{ value: minimumCoins }, { value: maximumCoins }] = await SettingsModel.findAll({
      attributes: ['value'],
      where: { key: ['MINIMUM_REDEEMABLE_COINS', 'MAXIMUM_REDEEMABLE_COINS'] }
    })

    userData.minRedeemableCoins = minimumCoins
    userData.maxRedeemableCoins = maximumCoins

    delete userProfile.dataValues.password
    t.commit()

    if (userProfile.profileImage !== '' && userProfile?.profileImage) {
      userProfile.profileImage = prepareImageUrl(userProfile?.profileImage)
    }
    return { success: true, data: userProfile, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
