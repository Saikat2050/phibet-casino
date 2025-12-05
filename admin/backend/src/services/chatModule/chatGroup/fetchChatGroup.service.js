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
        name: { type: ["string", "null"] },
        status: { type: ["string", "boolean", "null"] },
        isGlobal: { type: ["string", "boolean", "null"] },
        search: { type: ["string", "null"] },
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

export default class FetchChatGroupService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { chatGroup: ChatGroupModel, user: UserModel, segmentation: SegmentModel } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      const { filter, sort, range } = this.args;
      const pageSize = range?.pageSize ? Number(range.pageSize) : 10;
      const pageNo = range?.pageNo ? Number(range.pageNo) : 1;

      if (filter?.search) {
        filter.name = {
          [Op.like]: `%${filter.search}%`,
        };

        delete filter.search;
      }

      let uniqueUserIds = [];
      let uniqueSegments = [];
      let users = [];
      let segments = [];

      let group = await ChatGroupModel.findAndCountAll({
        where: filter,
        limit: pageSize,
        offset: (pageNo - 1) * pageSize,
        order: sort ? sort : [["createdAt", "DESC"]],
        transaction,
      });

      if (group.rows?.length > 0) {
        group.rows.forEach((item) => {
          uniqueUserIds = _.uniq(uniqueUserIds.concat(item.users || []));
          uniqueSegments = _.uniq(uniqueSegments.concat(item.segments || []));
        });

        // fetch all the users
        if (uniqueUserIds.length > 0) {
          users = await UserModel.findAll({
            where: {
              id: uniqueUserIds,
            },
            transaction,
          });
        }

        // fetch all the segments 
        if (uniqueSegments.length > 0) {
          segments = await SegmentModel.findAll({
            where: {
              id: uniqueSegments,
            },
            transaction,
          });
        }

        group.rows = group.rows.map((item) => {
          const groupData = item.toJSON();
          groupData.users = users.filter((user) => (groupData.users ?? []).includes(user.id));
          groupData.segments = segments.filter((segment) => (groupData.segments ?? []).includes(segment.id));
          groupData.criteria = GROUP_CRITERIA_ARRAY.map((criteria) => {
            return {
              ...criteria,
              value: groupData.criteria?.[criteria.key] || null,
            };
          });
          return groupData;
        });
      }

      return { success: true, group, totalPages: Math.ceil(Number(group.count || 0) / pageSize) };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
