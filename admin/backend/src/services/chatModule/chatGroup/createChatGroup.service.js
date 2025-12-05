import _ from "lodash";
import ajv from "@src/libs/ajv";
import { ServiceBase } from "@src/libs/serviceBase";
import { APIError } from "@src/errors/api.error";
import { GROUP_CRITERIA_ARRAY } from "@src/utils/constants/app.constants";

const constraints = ajv.compile({
  type: "object",
  properties: {
    name: { type: ["string", "null"], transform: ["trim", "toLowerCase"] },
    description: { type: ["string", "null"] },
    status: { type: "boolean" },
    criteria: {
      type: "array",
      items: {
        type: "object",
      },
    },
    segments: {
      type: "array",
    },
    users: {
      type: "array",
    },
    isGlobal: {
      type: "boolean",
    },
  },
  required: ["name", "description"],
});

export default class CreateChatGroupService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const {
      chatGroup: ChatGroupModel,
      user: UserModel,
      segmentation: SegmentationModel,
    } = this.context.sequelize.models;
    const transaction = this.context.sequelizeTransaction;

    try {
      const {
        name,
        description,
        status = true,
        criteria,
        isGlobal = false,
        segments,
        users,
      } = this.args;
      const filteredCriteria = [];

      const group = await ChatGroupModel.findOne({
        where: { name },
        transaction,
      });
      if (group) return this.addError("ThisGroupNameAlreadyExistsErrorType");

      if (isGlobal === false && !users?.length && !segments?.length) {
        return this.addError("AtLeastOneUserOrSegmentRequiredErrorType");
      }

      if (criteria && !_.isEmpty(criteria)) {
        for (const record of criteria) {
          if (!GROUP_CRITERIA_ARRAY.includes(record.key))
            return this.addError("ThisCriteriaDoesNotExistsErrorType");
          if (!filteredCriteria.includes(record.key))
            filteredCriteria.push({ key: record.key, value: record.value });
        }
      }

      if (isGlobal === true) {
        const globalGroup = await ChatGroupModel.findOne({
          where: { isGlobal: true },
          transaction
        })
        if (globalGroup) return this.addError('GlobalGroupExistErrorType')
      }

      if (users?.length) {
        const uniqueUsers = _.uniq(users);
        const usersAvailable = await UserModel.findAll({
          where: {
            id: uniqueUsers,
          },
          transaction,
        });
        if (usersAvailable.length !== uniqueUsers.length) {
          return this.addError("InvalidUsersErrorType");
        }
      }

      if (segments?.length) {
        const uniqueSegments = _.uniq(segments);
        const segmentsAvailable = await SegmentationModel.findAll({
          where: {
            id: uniqueSegments,
          },
          transaction,
        });
        if (segmentsAvailable.length !== uniqueSegments.length) {
          return this.addError("InvalidSegmentsErrorType");
        }
      }

      const dataToInsert = {
        name,
        description,
        status,
        criteria: filteredCriteria,
        admins: [],
        isGlobal,
        users: users?.length ? _.uniq(users) : [],
        segments: segments?.length ? _.uniq(segments) : [],
      };
      await ChatGroupModel.create(dataToInsert, { transaction });

      return { success: true };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
