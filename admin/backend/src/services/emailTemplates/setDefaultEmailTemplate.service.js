import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    emailTemplateId: { type: 'string' }
  },
  required: ['emailTemplateId']
})

export class SetDefaultEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const emailTemplate = await this.context.sequelize.models.emailTemplate.findOne({ where: { id: this.args.emailTemplateId } })
      if (!emailTemplate) return this.addError('EmailTemplateNotFoundErrorType')

      if (!emailTemplate.isDefault) {
        await this.context.sequelize.models.emailTemplate.update({ isDefault: false }, { where: { eventType: emailTemplate.eventType } })
        emailTemplate.isDefault = true
        await emailTemplate.save()
      }

      return { emailTemplate }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
