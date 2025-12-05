import { APIError } from "@src/errors/api.error";
import ajv from "@src/libs/ajv";
import ServiceBase from "@src/libs/serviceBase";

const constraints = ajv.compile({
  type: "object",
  properties: {
    id: { type: ["string", "number", "null"] },
    groupId: { type: ["string", "number", "null"] },
    pageSize: { type: ["string", "number", "null"] },
    pageNo: { type: ["string", "number", "null"] }

  },
  required: [],
});

export default class FetchChatDetailsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { chatDetail: ChatDetailModel, user: UserModel, } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      let { id, groupId, pageSize, pageNo } = this.args;
      pageSize = pageSize ? Number(pageSize) : 25;
      pageNo = pageNo ? Number(pageNo) : 1;

      if (!id && !groupId) {
        throw new APIError("ChatDetailIdOrGroupIdRequired");
      }
      const chatDetails = await ChatDetailModel.findAndCountAll({
        where: {
          ...(id ? { id } : {}),
          ...(groupId ? { groupId } : {}),
          isOffensive: false,
        },
        include: [
          {
            model: UserModel,
            as: "Sender",
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: pageSize,
        offset: (pageNo - 1) * pageSize,
        transaction,
      });

      const totalPages = Math.ceil(Number(chatDetails.count || 0) / pageSize);

      return { success: true, chatDetails: chatDetails.rows, totalPages, isChatEnded: pageNo >= totalPages };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
