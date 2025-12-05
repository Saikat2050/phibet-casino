import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    emailTemplateId: { type: 'string' }
  }
})

export class GetEmailTemplateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const emailTemplates = await this.context.sequelize.models.emailTemplate.findOne({ where: { id: this.args.emailTemplateId } })
      return emailTemplates
    } catch (error) {
      throw new APIError(error)
    }
  }
}
