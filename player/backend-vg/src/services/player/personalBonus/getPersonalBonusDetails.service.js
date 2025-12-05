import ServiceBase from '../../serviceBase'
import { BONUS_STATUS } from '../../../utils/constants/constant'
import { fn, col, literal } from 'sequelize'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetPersonalBonusDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: { PersonalBonus: PersonalBonusModel }
    } = this.context
    const { detail } = this.context.req.user
    const userId = detail.userId

    const result = await PersonalBonusModel.findOne({
      attributes: [
        [fn('COUNT', col('claimed_by')), 'claimedUserCount'],
        [fn('SUM', col('amount')), 'totalAmount'],
        [
          fn(
            'SUM',
            literal('CASE WHEN "coin_type" = \'GC\' THEN "amount" ELSE 0 END')
          ),
          'totalGCAmount'
        ],
        [
          fn(
            'SUM',
            literal('CASE WHEN "coin_type" = \'SC\' THEN "amount" ELSE 0 END')
          ),
          'totalSCAmount'
        ]
      ],
      where: {
        createdBy: userId,
        status: BONUS_STATUS.CLAIMED
      },
      group: ['created_by'],
      raw: true
    })

    const { claimedUserCount, totalAmount, totalGCAmount, totalSCAmount } = result

    const data = {
      claimedUsers: +claimedUserCount,
      totalAmount,
      totalGCAmount,
      totalSCAmount
    }
    return { data, message: SUCCESS_MSG.GET_SUCCESS, success: true }
  }
}
