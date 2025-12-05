import { APIError } from "@src/errors/api.error";
import ajv from "@src/libs/ajv";
import ServiceBase from "@src/libs/serviceBase";

const constraints = ajv.compile({
  type: "object",
  properties: {
    isGlobal: { type: ["string", "boolean", "null"] },
    userId: { type: 'number' }
  },
  required: [],
});

export default class FetchChatGroupService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { chatGroup: ChatGroupModel } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      const { isGlobal = true, userId } = this.args;

      const group = await ChatGroupModel.findAll({
        where: { isGlobal: typeof isGlobal === "string" ? isGlobal === "true" : isGlobal },
        order: [["createdAt", "DESC"]],
        transaction,
      });

      for (let i = 0; i < group.length; i++) {
        const chatGroup = group[i];

        if (chatGroup?.bannedUser?.length) {
          const userBanned = chatGroup.bannedUser.find((user) => Number(user) === Number(userId));

          if (userBanned) {
            group.splice(i, 1);
            i--;
            continue;
          }
        }
      }

      return { success: true, group };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
