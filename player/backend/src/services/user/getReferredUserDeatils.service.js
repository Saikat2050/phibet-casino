import { APIError } from '@src/errors/api.error'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetReferredUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { searchString, page, perPage, userId } = this.args

      const where = `u.referred_by = '${userId}' ${searchString ? 'and (u.email LIKE :searchString OR u.username LIKE :searchString OR u.first_name LIKE :searchString OR u.last_name LIKE :searchString)' : ''}`
      const queryObject = `
      SELECT
        u.id AS userId,
        u.username,
        u.created_at,
        json_agg(
          json_build_object(
            'transactionId', l.id,
            'transactionDate', l.created_at,
            'currencyId', l.currency_id,
            'currencyName',
              CASE l.currency_id
                WHEN 1 THEN 'GC Coins'
                WHEN 2 THEN 'BSC Coins'
                WHEN 3 THEN 'PSC Coins'
                WHEN 4 THEN 'RSC Coins'
                ELSE 'Unknown'
              END,
              'coinType',
              CASE
                WHEN l.currency_id = 1 THEN 'gc'
                ELSE 'sc'
              END,
            'amount', l.amount
          )
          ORDER BY l.created_at DESC
        ) FILTER (WHERE l.id IS NOT NULL) AS transactions
      FROM users u
      LEFT JOIN transactions t ON u.referred_by = t.user_id
      AND t.more_details IS NOT NULL
      AND t.more_details ->> 'referredTo' = u.id::text
      LEFT JOIN ledgers l ON l.transaction_id = t.id AND l.purpose = '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}'
      WHERE ${where}
      GROUP BY u.id, u.username
      ORDER BY u.created_at desc
      LIMIT ${perPage}
      OFFSET ${(page - 1) * perPage}
      `

      const referredUser = await this.context.sequelize.query(queryObject, { replacements: { searchString }, type: this.context.sequelize.QueryTypes.SELECT })

      return { referredUser: referredUser, page, totalPages: Math.ceil(referredUser.length / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
