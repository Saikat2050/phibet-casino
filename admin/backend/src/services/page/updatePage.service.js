import { APIError } from '@src/errors/api.error'
// import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import { populatePagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { PAGES_CATEGORY } from '@src/utils/constants/public.constants.utils'
// import { GetSettingsService } from '@src/services/common/getSettings.service'
// import { SETTING_KEYS } from '@src/utils/constants/app.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    pageId: { type: 'string' },
    slug: { type: 'string' },
    title: { type: 'object' },
    content: { type: 'object' },
    isActive: { type: 'boolean' },
    category: { enum: Object.values(PAGES_CATEGORY) }
  },
  required: ['pageId']
})

export class UpdatePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId, slug, title, content, isActive, category } = this.args
    const transaction = this.context.sequelizeTransaction
    const newPage = {}

    try {
      const page = await this.context.sequelize.models.page.findOne({ where: { id: pageId }, transaction })
      if (!page) return this.addError('PageNotFoundErrorType')

      if (slug) newPage.slug = slug
      newPage.isActive = isActive
      if (content) {
        // const contentObj = await getLanguageWiseNameJson(content, page.content)
        // const settings = await GetSettingsService.execute({ keys: [SETTING_KEYS.APPLICATION_NAME, SETTING_KEYS.USER_END_URL, SETTING_KEYS.DEFAULT_SUPPORT, SETTING_KEYS.LOGO] }, this.context)

        // const { userEndUrl, applicationName, logo, defaultSupport } = settings.result
        // const replacements = {
        //   '{{{siteUrl}}}': userEndUrl.value,
        //   '{{{siteName}}}': applicationName.value,
        //   '{{{siteLogo}}}': logo.value,
        //   '{{{supportEmailAddress}}}': defaultSupport.value
        // }
        // const regex = new RegExp(Object.keys(replacements).join('|'), 'g')
        // for (const [key, value] of Object.entries(contentObj)) {
        //   contentObj[key] = value.replace(regex, matched => replacements[matched])
        // }
        newPage.content = content
        // newPage.changed('content', true)
      }
      if (title) newPage.title = title
      if (category) newPage.category = category

      await this.context.sequelize.models.page.update({ ...newPage }, { where: { id: pageId }, transaction })
      await populatePagesCache(this.context)

      return { page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
