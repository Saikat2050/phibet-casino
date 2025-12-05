import _ from "lodash";
import ajv from "@src/libs/ajv";
import { ServiceBase } from "@src/libs/serviceBase";
import { APIError } from "@src/errors/api.error";
import { GROUP_CRITERIA_ARRAY } from "@src/utils/constants/app.constants";
import { Op } from "sequelize";

const constraints = ajv.compile({
  type: "object",
  properties: {
    id: { type: "string" },
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
    bannedUser: {
      type: ["array", "null"],
    },
    isGlobal: {
      type: "boolean",
    },
  },
  required: ["id"],
});

export default class UpdateChatGroupService extends ServiceBase {
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
        id,
        name,
        description,
        status,
        criteria,
        isGlobal,
        segments,
        users,
        bannedUser,
      } = this.args;
      const filteredCriteria = [];

      const groupExists = await ChatGroupModel.findOne({
        where: { id },
        transaction,
      });
      if (!groupExists) return this.addError("ChatGroupNotFoundErrorType");

      const group = await ChatGroupModel.findOne({
        where: { name, id: { [Op.ne]: id } },
        transaction,
      });
      if (group) return this.addError("ThisGroupNameAlreadyExistsErrorType");

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

      if (bannedUser?.length) {
        const uniqueUsers = _.uniq(bannedUser);
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

      const dataToUpdate = {
        name,
        description,
        status,
        criteria: filteredCriteria,
        admins: [],
        isGlobal,
        users: users?.length ? _.uniq(users) : [],
        segments: segments?.length ? _.uniq(segments) : [],
        bannedUser: bannedUser?.length ? _.uniq(bannedUser) : [],
      };
      await ChatGroupModel.update(dataToUpdate, { where: { id }, transaction });

      return { success: true };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
