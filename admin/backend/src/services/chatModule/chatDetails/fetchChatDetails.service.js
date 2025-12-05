import _, { filter } from "lodash";
import ajv from "@src/libs/ajv";
import { ServiceBase } from "@src/libs/serviceBase";
import { APIError } from "@src/errors/api.error";
import { GROUP_CRITERIA_ARRAY } from "@src/utils/constants/app.constants";

const constraints = ajv.compile({
  type: "object",
  properties: {
    filter: {
      type: ["object", "null"],
      properties: {
        id: { type: ["string", "number", "null"] },
        groupId: { type: ["string", "number", "null"] },
      },
    },
    sort: {
      type: ["array", "null"],
      items: {
        type: "array",
      },
    },
    range: {
      type: ["object", "null"],
      properties: {
        pageSize: { type: ["string", "number", "null"] },
        pageNo: { type: ["string", "number", "null"] },
      },
    },
  },
  required: [],
});

export default class FetchChatDetailsService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { chatDetail: ChatDetailModel } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      const { filter, sort, range } = this.args;
      const pageSize = range?.pageSize ? Number(range.pageSize) : 10;
      const pageNo = range?.pageNo ? Number(range.pageNo) : 1;

      if (!filter?.id && !filter?.groupId) {
        throw new APIError("ChatDetailIdOrGroupIdRequired");
      }

      const chatDetails = await ChatDetailModel.findAndCountAll({
        where: filter,
        limit: pageSize,
        offset: (pageNo - 1) * pageSize,
        order: sort ? sort : [["createdAt", "DESC"]],
        transaction,
      });

      return { success: true, chatDetails, totalPages: Math.ceil(Number(chatDetails.count || 0) / pageSize) };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
