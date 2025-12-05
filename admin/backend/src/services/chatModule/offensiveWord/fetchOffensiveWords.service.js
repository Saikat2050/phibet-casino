import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: "object",
  properties: {
    filter: {
      type: ["object", "null"],
      properties: {
        id: { type: ["string", "number", "null"] },
        words: { type: ["string", "null"] },
        status: { type: ["string", "boolean", "null"] },
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

export default class FetchOffensiveWordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { chatOffensiveWord: ChatOffensiveWordModel } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction;

    try {
      const { filter, sort, range } = this.args;
      const pageSize = range?.pageSize ? Number(range.pageSize) : 10;
      const pageNo = range?.pageNo ? Number(range.pageNo) : 1;

      if (filter?.search) {
        filter.words = {
          [Op.like]: `%${filter.search}%`,
        };

        delete filter.search;
      }

      const offensiveWords = await ChatOffensiveWordModel.findAndCountAll({
        where: filter,
        limit: pageSize,
        offset: (pageNo - 1) * pageSize,
        order: sort ? sort : [["createdAt", "DESC"]],
        transaction,
      });

      return { success: true, offensiveWords, totalPages: Math.ceil(Number(offensiveWords.count || 0) / pageSize) };
    } catch (error) {
      throw new APIError(error)
    } 
  }
}
