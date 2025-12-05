import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { PAYMENT_PROVIDER_CATEGORY } from '@src/utils/constants/payment.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'object' },
    aggregator: { type: 'string' },
    providerId: { type: 'number' },
    minWithdraw: { type: 'number' },
    maxWithdraw: { type: 'number' },
    depositAllowed: { type: 'boolean' },
    withdrawAllowed: { type: 'boolean' },
    depositDescription: { type: 'object' },
    withdrawDescription: { type: 'object' },
    depositKycRequired: { type: 'boolean' },
    withdrawKycRequired: { type: 'boolean' },
    depositPhoneRequired: { type: 'boolean' },
    depositImage: { type: ['object', 'null'] },
    withdrawPhoneRequired: { type: 'boolean' },
    withdrawImage: { type: ['object', 'null'] },
    depositProfileRequired: { type: 'boolean' },
    withdrawProfileRequired: { type: 'boolean' },
    category: { type: 'string', enum: Object.values(PAYMENT_PROVIDER_CATEGORY) },
    withdrawCardRequired: { type: 'boolean' },
    withdrawBankRequired: { type: 'boolean' }
  },
  required: ['name', 'category', 'aggregator']
})

export class UpdatePaymentProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction

    try {
      const depositImage = this.args.depositImage
      const withdrawImage = this.args.withdrawImage

      const paymentProvider = await this.context.sequelize.models.paymentProvider.findOne({
        where: { id: this.args.providerId }
      })
      if (!paymentProvider) return this.addError('PaymentProviderNotExistErrorType')

      paymentProvider.name = this.args.name
      paymentProvider.aggregator = this.args.aggregator
      paymentProvider.category = this.args.category
      paymentProvider.depositDescription = this.args.depositDescription
      paymentProvider.withdrawDescription = this.args.withdrawDescription
      paymentProvider.depositAllowed = this.args.depositAllowed
      paymentProvider.withdrawAllowed = this.args.withdrawAllowed
      paymentProvider.minWithdraw = this.args.minWithdraw
      paymentProvider.maxWithdraw = this.args.maxWithdraw
      paymentProvider.depositKycRequired = this.args.depositKycRequired
      paymentProvider.withdrawKycRequired = this.args.withdrawKycRequired
      paymentProvider.depositPhoneRequired = this.args.depositPhoneRequired
      paymentProvider.withdrawPhoneRequired = this.args.withdrawPhoneRequired
      paymentProvider.depositProfileRequired = this.args.depositProfileRequired
      paymentProvider.withdrawProfileRequired = this.args.withdrawProfileRequired
      paymentProvider.withdrawCardRequired = this.args.withdrawCardRequired
      paymentProvider.withdrawBankRequired = this.args.withdrawBankRequired

      if (depositImage) {
        const depositFileLocation = await uploadFile(depositImage.buffer, {
          name: `${depositImage.originalname}_${Date.now()}`,
          mimetype: depositImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.paymentProvider
        })
        paymentProvider.depositImage = depositFileLocation
      }

      if (withdrawImage) {
        const withdrawFileLocation = await uploadFile(withdrawImage.buffer, {
          name: `${withdrawImage.originalname}_${Date.now()}`,
          mimetype: withdrawImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.paymentProvider
        })
        paymentProvider.withdrawImage = withdrawFileLocation
      }

      await paymentProvider.save({ transaction })

      return { messages: 'Method updated successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
