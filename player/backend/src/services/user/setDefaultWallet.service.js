import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

// Validate input constraints
const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    type: { enum: Object.values(CURRENCY_TYPES) }
  },
  required: ['type', 'userId']
})

export class SetDefaultWalletService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    const { type, userId } = this.args

    try {
      // Update the wallet to set the specified type as default
      await this.context.sequelize.query(`
        UPDATE wallets
        SET is_default = CASE
                          WHEN currency_id IN (
                            SELECT id
                            FROM currencies
                            WHERE type = :type
                          ) THEN true
                          ELSE false
                        END
        WHERE user_id = :userId;
      `, {
        replacements: { userId, type },
        transaction // Ensure this is executed in the provided transaction
      })

      await transaction.commit()

      const wallets = await this.context.sequelize.models.wallet.findAll({
        where: { userId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: this.context.sequelize.models.currency,
          required: true,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      })

      return { success: true, wallets }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
