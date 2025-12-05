import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import UserComment from '@src/database/models/userComment.model'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    commentId: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    userId: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    adminUserId: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    title: { type: 'string', minLength: 1 },
    comment: { type: 'string', minLength: 1 },
    forUpdate: { type: 'boolean' }
  },
  required: ['userId', 'adminUserId', 'title', 'comment']
})

export class CreateCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { commentId, userId, adminUserId, title, comment, forUpdate } = this.args
    userId = Number(userId)
    adminUserId = Number(adminUserId)
    if (commentId !== undefined && commentId !== null && commentId !== '') commentId = Number(commentId)

    if (!userId || !adminUserId || !title.trim() || !comment.trim()) {
      throw new APIError('All fields are required and must be non-empty.')
    }
    if (forUpdate && (!commentId || isNaN(commentId))) {
      throw new APIError('Comment id is required for update.')
    }

    const { sequelize } = this.context
    const t = await sequelize.transaction()
    try {
      if (forUpdate) {
        // Update mode: require id
        const existingComment = await UserComment.findOne({ where: { id: commentId, userId }, transaction: t })
        if (!existingComment) {
          throw new APIError('No existing comment found for this user to update.')
        }
        await existingComment.update({
          commenterId: adminUserId,
          title: title.trim(),
          comment: comment.trim(),
          updatedAt: new Date()
        }, { transaction: t })
        await t.commit()
        return {
          message: 'Comment updated successfully.',
          comment: existingComment
        }
      } else {
        // Create mode
        const createdComment = await UserComment.create({
          userId,
          commenterId: adminUserId,
          title: title.trim(),
          comment: comment.trim(),
          createdAt: new Date(),
          updatedAt: new Date()
        }, { transaction: t })
        await t.commit()
        return {
          message: 'Comment created successfully.',
          comment: createdComment
        }
      }
    } catch (error) {
      await t.rollback()
      throw new APIError(error)
    }
  }
}
