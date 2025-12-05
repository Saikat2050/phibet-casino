import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreateTransactionService } from '@src/services/transaction/createTransaction.service'
import { LiveChatsEmitter } from '@src/socket-resources/emitters/chat.emitter'
import { MESSAGE_TYPE } from '@src/utils/constants/chat.constants'
import { LEDGER_PURPOSE, SWEEPS_COINS } from '@src/utils/constants/public.constants.utils'
import { v4 as uuid } from 'uuid'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    receiverName: { type: 'string' },
    amount: { type: 'number' },
    isTipPublic: { type: 'boolean' },
    currencyId: { type: 'number' },
    userId: { type: 'string' },
    groupId: { type: 'number' }
  },
  required: ['receiverName', 'amount', 'isTipPublic', 'currencyId', 'userId', 'groupId']
})

export class SendUserTipService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      user: UserModel,
      wallet: WalletModel,
      currency: CurrencyModel,
      message: UserChatModel,
      chatGroup: ChatGroupModel
    } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction

    try {
      const { receiverName, amount, userId, currencyId, groupId } = this.args

      const group = await ChatGroupModel.findOne({ where: { id: groupId }, transaction })
      if (!group) return this.addError('GroupNotExistErrorType')

      const checkUsername = await UserModel.findOne({
        attributes: ['id', 'username', 'imageUrl'],
        where: { username: receiverName },
        include: [{
          model: WalletModel,
          where: { currencyId: currencyId },
          include: {
            model: CurrencyModel,
            attributes: ['code', 'id', 'exchangeRate']
          }
        }],
        transaction
      })
      if (!checkUsername) return this.addError('ReceiverUserDoesNotExistErrorType')

      // getting user details
      const senderUserDetails = await UserModel.findOne({
        attributes: ['id', 'username', 'imageUrl'],
        where: { id: userId },
        include: {
          model: WalletModel,
          where: { currencyId: currencyId },
          include: {
            model: CurrencyModel,
            attributes: ['code', 'id', 'exchangeRate']
          }
        }
      })
      if (!senderUserDetails) return this.addError('UserDoesNotExistsErrorType')
      if (amount > senderUserDetails.wallets[0].amount) return this.addError('NotEnoughAmountErrorType')

      const currency = checkUsername.wallets[0].currency

      // creating tip sender user transaction
      await CreateTransactionService.execute({
        userId,
        paymentId: uuid(),
        purpose: currency.code === SWEEPS_COINS.GC ? LEDGER_PURPOSE.GIVE_TIP_GC : LEDGER_PURPOSE.GIVE_TIP_BSC,
        amount: amount,
        code: currency.code,
        wallet: senderUserDetails.wallets[0],
        currencyId: currency.id,
        moreDetails: {}
      }, this.context)

      // creating tip receiver user transaction
      await CreateTransactionService.execute({
        userId: checkUsername.id,
        paymentId: uuid(),
        purpose: currency.code === SWEEPS_COINS.GC ? LEDGER_PURPOSE.RECEIVE_TIP_GC : LEDGER_PURPOSE.RECEIVE_TIP_BSC,
        amount: amount,
        code: currency.code,
        wallet: checkUsername.wallets[0],
        currencyId: currency?.id,
        moreDetails: {}
      }, this.context)

      // create entry in message and emit  chat
      const userChat = await UserChatModel.create({
        actioneeId: userId,
        chatGroupId: groupId,
        message: null,
        recipientId: checkUsername.id,
        messageType: MESSAGE_TYPE.TIP,
        currencyId: currencyId,
        moreDetails: { amount: amount }
      }, { transaction })

      LiveChatsEmitter.emitLiveChats(
        {
          id: userChat.id,
          message: null,
          userId: parseInt(userId),
          groupId: groupId,
          isContainOffensiveWord: false,
          recipientId: null,
          recipientUser: {
            username: checkUsername.username,
            profilePicture: checkUsername.imageUrl
          },
          gif: null,
          messageType: MESSAGE_TYPE.TIP,
          createdAt: new Date(),
          user: {
            profilePicture: senderUserDetails.imageUrl,
            username: senderUserDetails.username
          },
          moreDetails: { amount: amount },
          currency
        },
        groupId
      )

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
