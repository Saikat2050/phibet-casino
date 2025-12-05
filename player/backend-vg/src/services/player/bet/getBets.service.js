// import { DATE_FORMAT } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../serviceBase'
import { pageValidation } from '../../../utils/common'
import ajv from '../../../libs/ajv'
import moment from 'moment'
import { sequelize } from '../../../db/models'
import { QueryTypes } from 'sequelize'
const schema = {
  type: 'object',
  properties: {
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    page: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    coinType: {
      type: 'string',
      enum: ['SC', 'GC']
    }
  },
  required: ['coinType']
}

const constraints = ajv.compile(schema)

export class GetBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { userId } = this.context.req.user.detail

      let { limit, page, startDate = null, endDate = null, coinType } = this.args

      const { pageNo, size } = pageValidation(page, limit)

      if (!startDate) {
        const newDate = new Date()
        newDate.setDate(newDate.getDate() - 7)
        startDate = new Date(newDate.setHours(0, 0, 0, 0)).toISOString()
        endDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
      }

      if (moment(startDate) > moment(endDate)) {
        return this.addError('InvalidDateErrorType')
      }

      startDate = new Date(startDate).toISOString()
      endDate = new Date(endDate).toISOString()

      const allTransactionsOptions = {
        replacements: {
          user_id: userId,
          startDate,
          endDate,
          amount_type: coinType === 'GC' ? 0 : 1,
          size,
          offset: size * (pageNo - 1)
        },
        type: QueryTypes.SELECT
      }

      const totalBets = await sequelize.query(
        `SELECT COUNT(*)
    FROM
        (
            SELECT
                ct.round_id,
                (CASE WHEN action_type = 'bet' THEN ct.amount ELSE 0 END) AS bet_amount,
                (CASE WHEN action_type IN ('win', 'lost') THEN ct.amount ELSE 0 END) AS win_amount,
                ct.game_id,
                ct.game_identifier as name,
                ct.created_at,
                ct.casino_transaction_id,
                mct.name as game_identifier
            FROM casino_transactions ct
            JOIN master_casino_games mct ON ct.game_identifier = mct.identifier
            WHERE ct.user_id = :user_id AND ct.amount_type = :amount_type AND date(ct.created_at) >= :startDate AND date(ct.created_at) <= :endDate
        ) AS subquery
    GROUP BY round_id, name
        `,
        allTransactionsOptions
      )

      const myBets = await sequelize.query(
        `SELECT
        round_id,
        SUM(bet_amount) AS bet_amount,
        SUM(win_amount) AS win_amount,
        string_agg(DISTINCT game_id::character varying,'') AS game_id,
        string_agg(DISTINCT game_identifier::character varying,'') AS game_identifier,
        MAX(created_at) AS created_at,
        name
    FROM
        (
            SELECT
                ct.round_id,
                (CASE WHEN action_type = 'bet' THEN ct.amount ELSE 0 END) AS bet_amount,
                (CASE WHEN action_type IN ('win', 'lost') THEN ct.amount ELSE 0 END) AS win_amount,
                ct.game_id,
                ct.game_identifier as name,
                ct.created_at,
                ct.casino_transaction_id,
                mct.name as game_identifier
            FROM casino_transactions ct
            JOIN master_casino_games mct ON ct.game_identifier = mct.identifier
            WHERE ct.user_id = :user_id AND ct.amount_type = :amount_type AND date(ct.created_at) >= :startDate AND date(ct.created_at) <= :endDate
        ) AS subquery
    GROUP BY round_id, name
    ORDER BY created_at DESC
    LIMIT :size
    OFFSET :offset
        `,
        allTransactionsOptions
      )

      return { data: { count: totalBets?.length, rows: myBets } || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
