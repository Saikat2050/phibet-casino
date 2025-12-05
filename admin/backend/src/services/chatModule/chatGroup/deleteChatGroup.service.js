import { APIError } from "@src/errors/api.error";
import ajv from "@src/libs/ajv";
import { ServiceBase } from "@src/libs/serviceBase";

const constraints = ajv.compile({
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
});

export default class DeleteChatGroupService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { chatGroup: ChatGroupModel } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      const { id } = this.args;

      const group = await ChatGroupModel.findOne({
        where: { id },
        transaction,
      });
      if (!group) return this.addError("ChatGroupNotFoundErrorType");

      if (group.isGlobal) {
        return this.addError("GlobalGroupCannotBeDeletedErrorType");
      }

      await group.destroy({ transaction });

      return { success: true };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
