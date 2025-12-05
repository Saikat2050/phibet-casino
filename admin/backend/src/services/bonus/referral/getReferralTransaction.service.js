import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SWEEPS_COINS, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  }
})

export class GetReferralTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString

    try {
      const where = `EXISTS (SELECT 1 FROM users r WHERE r.referred_by = u.id) ${searchString ? 'and (u.email LIKE :searchString OR u.username LIKE :searchString OR u.first_name LIKE :searchString OR u.last_name LIKE :searchString' : ''}`
      const queryObject = `
      SELECT
      u.id,
      u.username,
      u.email,
      u.first_name,
      u.last_name,
      (
        SELECT COUNT(*)
        FROM users r
        WHERE r.referred_by = u.id
      ) AS referral_count,
      MAX(ru.created_at) AS last_referral_date,
      SUM(CASE WHEN cu.code = '${SWEEPS_COINS.GC}' THEN l.amount ELSE 0 END) AS GCAmount,
      SUM(CASE WHEN cu.code = '${SWEEPS_COINS.BSC}' THEN l.amount ELSE 0 END) AS BSCAmount
      FROM users u
      LEFT JOIN users ru ON ru.referred_by = u.id
      LEFT JOIN transactions t ON u.id = t.user_id
      LEFT JOIN ledgers l ON l.transaction_id = t.id AND (l.purpose = '${LEDGER_PURPOSE.REFERRAL_DEPOSIT}' OR l.id IS NULL)
      LEFT JOIN currencies cu ON l.currency_id = cu.id
      WHERE ${where}
      GROUP BY u.id, u.username, u.email
      ORDER BY last_referral_date DESC NULLS LAST
      LIMIT ${perPage}
      OFFSET ${(page - 1) * perPage}`

      const referralTransaction = await this.context.sequelize.query(queryObject, { type: this.context.sequelize.QueryTypes.SELECT })

      const count = await this.context.sequelize.query(`SELECT count(id) FROM users u WHERE ${where}`, { type: this.context.sequelize.QueryTypes.SELECT })
      return { referralTransaction, page, totalPages: Math.ceil(count[0]?.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
