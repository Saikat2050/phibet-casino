import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getOne } from '../../utils/crud'
import ajv from '../../libs/ajv'
import { defaultLanguage } from '../../utils/constants/constant'

import { insertDynamicDataInCmsTemplate, getDynamicDataValue } from '../../utils/common'
import config from '../../configs/app.config'

const schema = {
  type: 'object',
  properties: {
    cmsId: {
      type: 'string'
    },
    footer: {
      type: 'string',
      enum: ['0', '1']
    },
    pageSlug: {
      type: 'string'
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetCmsDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      CmsPage: CmsPageModel
    } = this.context.dbModels
    const { cmsId, footer, pageSlug } = this.args
    if (+footer) {
      const cmsData = await getOne({
        model: CmsPageModel,
        data: { category: 4, isActive: true }
      })
      return { success: true, data: cmsData ?? {}, message: SUCCESS_MSG.GET_SUCCESS }
    }

    if ((cmsId === '' || !(+cmsId >= 0)) && !pageSlug) return this.addError('InvalidIdErrorType')
    const data = {
      isActive: true
    }
    if (cmsId) {
      data.cmsPageId = cmsId
    } else if (pageSlug) {
      data.slug = pageSlug
    }
    const cmsData = await getOne({
      model: CmsPageModel,
      data
    })
    if (cmsData) {
      cmsData.dataValues.link = `${config.get('frontendUrl')}/cms/${cmsData.dataValues.slug}`
      cmsData.content[defaultLanguage] = insertDynamicDataInCmsTemplate({ template: cmsData.content[defaultLanguage], dynamicData: await getDynamicDataValue() })
      return { success: true, data: cmsData ?? {}, message: SUCCESS_MSG.GET_SUCCESS }
    } else {
      return { success: false, data: cmsData ?? {}, message: SUCCESS_MSG.GET_SUCCESS }
    }
  }
}
