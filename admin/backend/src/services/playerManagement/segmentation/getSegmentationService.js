import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    id: { type: 'string' },
    searchString: { type: 'string', transform: ['toLowerCase', 'trim'] }
  }
})

export class GetSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      args: { page, perPage, searchString, id },
      context: { models: { segmentation: segmentationModel } }
    } = this

    try {
      if (id) {
        const segment = await segmentationModel.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { id }
        })
        return { segment }
      }

      const where = {}
      if (searchString) where.name = { [Op.iLike]: `%${searchString}%` }

      const segmentations = await segmentationModel.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })

      return { segments: segmentations.rows, page, totalPages: Math.ceil(segmentations.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
