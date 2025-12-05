import ajv from '../../libs/ajv'
import { Op } from 'sequelize'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { PAGE_ASSET_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    search: { type: ['string'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetPagesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, search, orderBy, sort } = this.args
    const s3Config = config.getProperties().s3

    const {
      dbModels: {
        PageContent: PageContentModel
      }
    } = this.context
    let query
    if (search) {
      query = { ...query, pageName: { [Op.iLike]: `%${search.trim()}%` } }
    }

    try {
      const { page, size } = pageValidation(pageNo, limit)
      let pages
      if (pageNo && limit) {
        pages = await PageContentModel.findAndCountAll({
          where: query,
          order: [[orderBy || 'pageId', sort || 'ASC']],
          limit: size,
          offset: ((page - 1) * size)
        })
      } else {
        pages = await PageContentModel.findAndCountAll({
          where: query,
          order: [[orderBy || 'pageId', sort || 'ASC']]
        })
      }
      const updatedRows = []
      pages?.rows?.forEach(({ dataValues: page }) => {
        const updatedAssets = {}
        const assets = Object.values(page.assets || {})
        assets?.forEach((asset) => {
          if (asset.assetType === PAGE_ASSET_TYPE.DIGITAL) {
            console.log(s3Config.S3_DOMAIN_KEY_PREFIX)
            const dAsset = { ...asset, assetValue: `${s3Config.S3_DOMAIN_KEY_PREFIX}${asset.assetValue}` }
            updatedAssets[asset.assetKey] = dAsset
          } else updatedAssets[asset.assetKey] = asset
        })
        updatedRows.push({ ...page, assets: updatedAssets })
      })

      return { pages: { ...pages, rows: updatedRows }, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
