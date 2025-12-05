import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    title: { type: 'string' },
    userId: { type: 'string' },
    comment: { type: 'string' },
    adminUserId: { type: 'string' }
  },
  required: ['adminUserId', 'title', 'userId', 'comment']
})

export class UpdateCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const title = this.args.title
    const userId = this.args.userId
    const comment = this.args.comment
    const adminUserId = this.args.adminUserId
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        include: {
          model: this.context.sequelize.models.userComment
        },
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const userComment = user.userComment
      if (!userComment) return this.addError('CommentDoesNotExistsErrorType')

      userComment.title = title
      userComment.comment = comment
      userComment.commenterId = adminUserId
      await userComment.save({ transaction })

      return userComment
    } catch (error) {
      throw new APIError(error)
    }
  }
}
