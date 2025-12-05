import ServiceBase from '../../serviceBase'
import { fn, col, literal } from 'sequelize'
import { pageValidation } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { BONUS_STATUS } from '../../../utils/constants/constant'

export class GetPersonalBonusService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail }
      },
      dbModels: { PersonalBonus: PersonalBonusModel, User: UserModel }
    } = this.context

    const userId = detail.userId

    const { page, limit } = this.args

    const { pageNo, size } = pageValidation(page, limit)

    const bonusDetails = await PersonalBonusModel.findAndCountAll({
      where: {
        createdBy: userId
      },
      include: [
        {
          model: UserModel,
          as: 'claimedUser',
          attributes: ['firstName', 'lastName', 'username']
        }
      ],
      limit: size,
      distinct: true,
      offset: (pageNo - 1) * size,
      order: [['createdAt', 'DESC']]
    })

    const result = await PersonalBonusModel.findOne({
      attributes: [
        [fn('COUNT', col('claimed_by')), 'claimedUsers'],
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

    return {
      bonusDetails,
      data: { ...result },
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
