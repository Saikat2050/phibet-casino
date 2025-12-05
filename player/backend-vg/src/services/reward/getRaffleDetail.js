import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { prepareImageUrl } from '../../utils/common'
import { minus, divide, times } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  ACTION_TYPE,
  AMOUNT_TYPE,
  CASINO_ACTION_TYPE,
  CASINO_TRANSACTION_STATUS
} from '../../utils/constants/constant'
import { raffleHelper } from '../../helpers/raffle.helper'
export default class GetRaffleDetail extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel,
        CasinoTransaction: CasinoTransactionModel
      }
    } = this.context

    const { recursive = false } = this.args
    const currentDate = new Date()
    const raffleDetail = await RafflesModel.findOne({
      where: {
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate }
      },
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'winnerId',
          'status',
          'wonDate',
          'moreDetails'
        ]
      },
      raw: true
    })
    //  get userId here
    let userId
    const req = this.context.req
    const token = req.headers.cookie?.split('accessToken=')[1]?.split(';')[0]
    if (token) {
      try {
        const decodedToken = token
          ? await jwt.verify(token, config.get('jwt.loginTokenSecret'))
          : null
        userId = decodedToken?.id
      } catch (error) {}
    }

    if (!raffleDetail) return this.addError('GiveawaysNotFoundErrorType')
    if (!raffleDetail.isActive) return this.addError('NoAnyGiveawaysActive')

    const raffleDetailData = raffleDetail
    if (raffleDetail.imageUrl) {
      raffleDetailData.imageUrl = prepareImageUrl(raffleDetail.imageUrl)
    }
    let userTicket = []
    let betSum = 0

    const wagerBaseAmt = raffleDetail.wagerBaseAmt

    if (!userId) {
      raffleDetailData.betSum = betSum
      raffleDetailData.coinType = raffleDetail.wagerBaseAmtType
      raffleDetailData.userTicket = userTicket
      raffleDetailData.nextTicket = {
        wagerBaseAmt: wagerBaseAmt,
        requiredAmt: 0,
        progressPercentage: 0,
        ticketCount: 0
      }
      return {
        raffleDetail: raffleDetailData,
        message: SUCCESS_MSG.GET_SUCCESS,
        success: true
      }
    } else {
      betSum =
        (await CasinoTransactionModel.sum('amount', {
          where: {
            userId: userId,
            actionType: CASINO_ACTION_TYPE.BET,
            actionId: ACTION_TYPE.DEBIT,
            status: CASINO_TRANSACTION_STATUS.COMPLETED,
            amountType:
              raffleDetail.wagerBaseAmtType === 'SC'
                ? AMOUNT_TYPE.SC_COIN
                : AMOUNT_TYPE.GC_COIN,
            createdAt: {
              [Op.between]: [raffleDetail.startDate, raffleDetail.endDate]
            }
          }
        })) ?? 0

      const noOfAcquiredTickets =
        (await RafflesEntryModel.count({
          where: {
            raffleId: raffleDetail.raffleId,
            userId: userId,
            isActive: true
          }
        })) ?? 0

      const requiredAmt = +minus(
        betSum,
        times(+wagerBaseAmt, +noOfAcquiredTickets)
      )

      const progressResult = Math.floor(
        +times(+divide(requiredAmt, wagerBaseAmt), 100)
      )

      if (progressResult > 100 && !recursive) {
        await raffleHelper(userId)
        return await GetRaffleDetail.execute(
          { ...this.args, recursive: true },
          this.context
        )
      }

      raffleDetailData.nextTicket = {
        wagerBaseAmt: wagerBaseAmt,
        requiredAmt: requiredAmt,
        progressPercentage: progressResult,
        ticketCount: noOfAcquiredTickets
      }
      raffleDetailData.betSum = betSum
      raffleDetailData.coinType = raffleDetail.wagerBaseAmtType

      userTicket = await RafflesEntryModel.findAll({
        attributes: ['entryId', 'createdAt'],
        where: {
          raffleId: raffleDetail.raffleId,
          userId: userId,
          isActive: true
        },
        raw: true
      })

      raffleDetailData.userTicket = userTicket
      return {
        raffleDetail: raffleDetailData,
        message: SUCCESS_MSG.GET_SUCCESS,
        success: true
      }
    }
  }
}
