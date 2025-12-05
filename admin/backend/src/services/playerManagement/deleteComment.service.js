import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import UserComment from '@src/database/models/userComment.model'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    commentId: { anyOf: [{ type: 'string' }, { type: 'number' }] }
  },
  required: ['commentId']
})

export class DeleteCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { commentId } = this.args
    if (!commentId) {
      throw new APIError('commentId and adminUserId are required.')
    }
    commentId = Number(commentId)
    const { sequelize } = this.context
    const t = await sequelize.transaction()
    try {
      const comment = await UserComment.findOne({ where: { id: commentId }, transaction: t })
      if (!comment) {
        throw new APIError('Comment not found.')
      }
      await comment.destroy({ transaction: t })
      await t.commit()
      return { message: 'Comment deleted successfully.' }
    } catch (error) {
      await t.rollback()
      throw new APIError(error)
    }
  }
}
