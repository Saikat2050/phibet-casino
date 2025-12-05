import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { sendMail } from '../../libs/sendgrid'
import { EMAIL_TEMPLATES } from '../../utils/constants/constant'

export class UserFeedbackService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      }
    } = this.context

    const { title, body } = this.args

    sendMail({
      email: 'support@vegascoins.com',
      userId: user.userId,
      emailTemplate: EMAIL_TEMPLATES.USER_FEEDBACK,
      dynamicData: {
        email: user.email,
        user_id: user.userId,
        name: user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.firstName || 'User',
        title,
        body
      }
    })
    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
