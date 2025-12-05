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
    minWithdraw: { type: 'number' },
    maxWithdraw: { type: 'number' },
    depositAllowed: { type: 'boolean' },
    withdrawAllowed: { type: 'boolean' },
    depositDescription: { type: 'object' },
    withdrawDescription: { type: 'object' },
    depositKycRequired: { type: 'boolean' },
    withdrawKycRequired: { type: 'boolean' },
    depositPhoneRequired: { type: 'boolean' },
    withdrawPhoneRequired: { type: 'boolean' },
    depositImage: { type: ['object', 'null'] },
    withdrawImage: { type: ['object', 'null'] },
    depositProfileRequired: { type: 'boolean' },
    withdrawProfileRequired: { type: 'boolean' },
    withdrawCardRequired: { type: 'boolean' },
    withdrawBankRequired: { type: 'boolean' },
    category: { type: 'string', enum: Object.values(PAYMENT_PROVIDER_CATEGORY) }
  },
  required: ['name', 'category', 'aggregator']
})

export class CreatePaymentProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction

    try {
      const depositImage = this.args.depositImage
      const withdrawImage = this.args.withdrawImage

      const providerDetails = await this.context.sequelize.models.paymentProvider.findOrCreate({
        where: { name: { EN: this.args.name.EN.toUpperCase() } },
        defaults: {
          name: this.args.name,
          aggregator: this.args.aggregator,
          category: this.args.category,
          depositDescription: this.args.depositDescription,
          withdrawDescription: this.args.withdrawDescription,
          depositAllowed: this.args.depositAllowed,
          withdrawAllowed: this.args.withdrawAllowed,
          minWithdraw: this.args.minWithdraw,
          maxWithdraw: this.args.maxWithdraw,
          depositKycRequired: this.args.depositKycRequired,
          withdrawKycRequired: this.args.withdrawKycRequired,
          depositPhoneRequired: this.args.depositPhoneRequired,
          withdrawPhoneRequired: this.args.withdrawPhoneRequired,
          depositProfileRequired: this.args.depositProfileRequired,
          withdrawProfileRequired: this.args.withdrawProfileRequired,
          withdrawCardRequired: this.args.withdrawCardRequired,
          withdrawBankRequired: this.args.withdrawBankRequired
        },
        raw: true,
        transaction
      })

      const paymentProvider = providerDetails?.[0] || providerDetails

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

      return { messages: 'Method created successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
