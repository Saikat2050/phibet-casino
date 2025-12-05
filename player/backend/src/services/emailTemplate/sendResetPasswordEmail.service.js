import ServiceBase from '@src/libs/serviceBase'
// import { APIError } from '@src/errors/api.error'
import { sendEmail } from '@src/libs/s3'
import { sequelize } from '@src/database/models'
import { Logger } from '@src/libs/logger'

export class SendResetPasswordEmailService extends ServiceBase {
  async run () {
    const EmailTemplateModel = sequelize.models.emailTemplate

    try {
      const emailTemplateData = await EmailTemplateModel.findOne({ where: { eventType: this.args.eventType, isDefault: true } })
      if (!emailTemplateData) return this.addError('EmailTemplateNotFoundErrorType')

      let mailData
      if (emailTemplateData) {
        mailData = emailTemplateData.templateCode.EN
        if (emailTemplateData?.dynamicData) {
          emailTemplateData.dynamicData.map((key) => {
            mailData = mailData.replaceAll(`{{${key}}}`, this.args[key])
            return null
          })
        }
      }

      const emailSent = await sendEmail({
        htmlContent: mailData,
        subject: 'Reset Your Password - Phibet',
        fromEmail: 'noreply@phibet.com',
        toEmail: this.args.email
      })

      return { success: true, data: emailSent }
    } catch (error) {
      Logger.error(`Error in sending reset password mail - ${error}`)
      return { success: false }
    }
  }
}
