import { APIError } from "@src/errors/api.error";
import ajv from "@src/libs/ajv";
import ServiceBase from "@src/libs/serviceBase";
import { LiveChatsEmitter } from "@src/socket-resources/emitters/chat.emitter";

const constraints = ajv.compile({
  type: "object",
  properties: {
    id: { type: ["string", "number", "null"] },
    groupId: { type: ["string", "number", "null"] },
    message: { type: "string" },
    isGif: { type: ["boolean", "null"] },
    userId: { type: "number" },
  },
  required: ["message", "userId"],
});

export default class CreateChatDetailsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      chatDetail: ChatDetailModel,
      chatOffensiveWord: ChatOffensiveWordModel,
      user: UserModel,
    } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      const { id, groupId, message, isGif, userId } = this.args;
      let isOffensive = false;

      if (!id && !groupId) {
        throw new APIError("ChatDetailIdOrGroupIdRequired");
      }

      if (!isGif) {
        const offensiveWords = await ChatOffensiveWordModel.findAll();
        for (const offensiveWord of offensiveWords) {
          const regex = new RegExp(offensiveWord.words, "i");

          if (regex.test(message)) {
            isOffensive = true;
            break;
          }
        }
      }

      const user = await UserModel.findByPk(userId);
      if (!user) return this.addError("UserNotExistsErrorType");

      const dataToInsert = {
        receiver: id || null,
        groupId: groupId || null,
        message,
        isGif: isGif || false,
        sender: userId,
        isOffensive,
      };
      const userChat = await ChatDetailModel.create(dataToInsert, {
        transaction,
      });

      // Fetch the complete message with Sender details
      const completeMessage = await ChatDetailModel.findByPk(userChat.id, {
        include: [
          {
            model: UserModel,
            as: 'Sender',
            attributes: [
              'id', 'username', 'firstName', 'lastName', 'email', 'emailVerified',
              'phoneCode', 'phone', 'phoneVerified', 'languageId', 'dateOfBirth',
              'gender', 'loggedIn', 'lastLoggedInIp', 'loggedInAt', 'imageUrl',
              'kycStatus', 'kycLevel', 'kycVerifiedAt', 'kycVerifiedBy',
              'kycRejectionReason', 'kycMetadata', 'kycLastActivity', 'isActive',
              'countryId', 'sessionLimit', 'referredBy', 'newOtpRequested',
              'paysafeCustomerId', 'uniqueId', 'scWaggeredAmount', 'createdAt',
              'updatedAt', 'signInMethod', 'approvelyWithdrawerId', 'affiliateId',
              'affiliateCode', 'moreDetails', 'newPasswordKey', 'newPasswordRequested',
              'emailToken', 'newEmailRequested', 'chatSettings', 'phoneOtp',
              'authEnable', 'authUrl', 'authSecret', 'isProfile', 'isUpdateProfile',
              'isJackpotTermsAccepted', 'isJackpotOptedIn', 'jackpotMultiplier'
            ]
          }
        ]
      });

      if (!isOffensive) {
        // Emit socket event for new chat detail
        LiveChatsEmitter.emitLiveChats(
          {
            id: userChat.id,
            message: userChat.message,
            userId: userChat.sender,
            groupId: userChat.groupId,
            isContainOffensiveWord: userChat.isOffensive,
            recipientId: userChat.receiver,
            recipientUser: null,
            gif: userChat.isGif,
            messageType: 'TEXT', // Default message type
            createdAt: userChat.createdAt,
            Sender: {
              profilePicture: user.avatarImage,
              username: user.username,
              rankingLevel: user.rankingLevel,
              rankingName: user.rankingName,
            },
          },
          groupId || id,
          userId
        );
      }

      console.log('=== CHAT MESSAGE CREATED ===');
      console.log('Complete message object:', JSON.stringify(completeMessage, null, 2));
      console.log('Message ID:', completeMessage?.id);
      console.log('Message text:', completeMessage?.message);
      console.log('Sender username:', completeMessage?.Sender?.username);
      console.log('Created at:', completeMessage?.createdAt);
      console.log('================================');

      return {
        success: true,
        data: completeMessage
      };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
