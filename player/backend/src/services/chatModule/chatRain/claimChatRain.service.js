import { CURRENCY_TYPES, LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import ServiceBase from '@src/libs/serviceBase'
import { LiveChatsRainEmitter } from '@src/socket-resources/emitters/chatRain.emitter.js'
import ajv from '@src/libs/ajv'
import { v4 as uuid } from 'uuid'
import { CreateTransactionService } from '@src/services/transaction/createTransaction.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    groupId: { type: 'number' },
    chatRainId: { type: 'number' },
    userId: { type: 'number', default: 1 }
  },
  required: ['groupId', 'chatRainId', 'userId']
})

export class ClaimChatRainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      chatRain: ChatRainModel,
      user: UserModel,
      chatRainUser: ChatRainUserModel,
      currency: CurrencyModel,
      wallet: WalletModel
    } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction

    try {
      const { userId, chatRainId, groupId } = this.args

      const alreadyGrabbed = await ChatRainUserModel.findOne({ where: { userId, chatRainId } })
      if (alreadyGrabbed) return this.addError('ChatRainAlreadyGrabbedErrorType')

      const chatRainExist = await ChatRainModel.findOne({
        where: { id: chatRainId, chatGroupId: groupId },
        include: {
          model: CurrencyModel,
          attributes: ['code', 'id']
        }
      })

      if (!chatRainExist) return this.addError('ChatRainNotFoundErrorType')
      if (chatRainExist.isClosed) return this.addError('ChatRainClosedErrorType')

      const user = await UserModel.findByPk(userId, { raw: true })
      if (!user) return this.addError('UserNotExistsErrorType')

      const grabbedCount = await ChatRainUserModel.findAndCountAll({ where: { chatRainId } })

      if (grabbedCount.count === chatRainExist.playersCount) return this.addError('MaxChatRainCountReachedErrorType')
      else if (Number(grabbedCount.count) + 1 === chatRainExist.playersCount) {
        chatRainExist.isClosed = true
        await chatRainExist.save({ transaction })
      }
      const amount = (chatRainExist.prizeMoney / chatRainExist.playersCount).toFixed(2)

      if (amount > 0) {
        const wallet = await WalletModel.findOne({
          where: { userId },
          include: {
            model: CurrencyModel,
            where: { isActive: true, code: chatRainExist?.currency?.code },
            required: true
          }
        })
        if (!wallet) return this.addError('InvalidWalletIdErrorType')

        await CreateTransactionService.execute({
          userId,
          paymentId: uuid(),
          purpose: chatRainExist?.currency?.code === SWEEPS_COINS.GC ? LEDGER_PURPOSE.CHAT_RAIN_GRAB_GC : LEDGER_PURPOSE.CHAT_RAIN_GRAB_BSC,
          amount: amount,
          code: chatRainExist?.currency?.code,
          wallet: wallet,
          currencyId: chatRainExist?.currency?.id,
          moreDetails: { rainId: chatRainExist.id }
        }, this.context)
      }

      // if last chat rain grab user than close chat rain
      if (chatRainExist.currency.type === CURRENCY_TYPES.SWEEP_COIN || Number(grabbedCount.count) + 1 === chatRainExist.playersCount) {
        LiveChatsRainEmitter.emitClosedChatRain(
          {
            chatRainId,
            name: chatRainExist.name,
            description: chatRainExist.description,
            prizeMoney: chatRainExist.prizeMoney,
            currency: chatRainExist.currency,
            isClosed: true,
            chatGroupId: chatRainExist.chatGroupId
          },
          chatRainExist.chatGroupId
        )
      }

      // create entry in user model
      const claimData = await ChatRainUserModel.create({ chatRainId, userId, winAmount: amount }, { transaction })

      return { message: 'ChatRain claimed successfully', claimData }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
