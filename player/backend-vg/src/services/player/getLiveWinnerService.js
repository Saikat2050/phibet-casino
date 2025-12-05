import { prepareImageUrl } from '../../utils/common'
import {
  AMOUNT_TYPE,
  CASINO_ACTION_TYPE
} from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'

export default class GetLiveWinnersService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        MasterCasinoGame: MasterCasinoGameModel,
        CasinoTransaction: CasinoTransactionModel,
        MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel
      }
    } = this.context

    const games = await CasinoTransactionModel.findAll({
      where: {
        actionType: CASINO_ACTION_TYPE.WIN,
        amountType: AMOUNT_TYPE.SC_COIN
      },
      attributes: ['gameIdentifier', 'amount', 'userId', 'createdAt'],
      include: [
        {
          attributes: ['masterCasinoGameId', 'name'],
          model: MasterCasinoGameModel,
          required: true,
          include: [
            {
              model: MasterCasinoGamesThumbnailModel
            }
          ]
        },
        {
          attributes: ['userId', 'username'],
          model: UserModel,
          required: true
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    })

    if (games.length < 1) {
      return {
        success: true,
        data: [],
        message: SUCCESS_MSG.GET_SUCCESS
      }
    }

    const filteredGames = []
    await Promise.allSettled(
      games?.map(async game => {
        await Promise.allSettled(
          game?.MasterCasinoGame?.MasterCasinoGamesThumbnails.map(
            async image => {
              image.thumbnail = prepareImageUrl(image.thumbnail)
            }
          )
        )
        filteredGames.push({
          thumbnails: game?.MasterCasinoGame?.MasterCasinoGamesThumbnails ?? [],
          userName: game.User.username,
          amount: game.amount
        })
      })
    )
    return {
      success: true,
      data: filteredGames,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
