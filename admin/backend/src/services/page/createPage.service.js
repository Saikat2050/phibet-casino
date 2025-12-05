import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import { populatePagesCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { GetSettingsService } from '@src/services/common/getSettings.service'
import { PAGES_CATEGORY } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    slug: { type: 'string' },
    title: { type: 'object' },
    content: { type: 'object' },
    isActive: { type: 'boolean' },
    category: { enum: Object.values(PAGES_CATEGORY) }
  },
  required: ['slug', 'title', 'content', 'category']
})

export class CreatePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { category, slug, title, content } = this.args
    const isActive = Object.prototype.hasOwnProperty.call(this.args, 'isActive') ? this.args.isActive : true
    const transaction = this.context.sequelizeTransaction

    try {
      let page = await this.context.sequelize.models.page.findOne({ where: { slug }, transaction })
      if (page) return this.addError('PageSlugAlreadyExistsErrorType')

      const settings = await GetSettingsService.execute({ keys: [SETTING_KEYS.APPLICATION_NAME, SETTING_KEYS.USER_END_URL, SETTING_KEYS.DEFAULT_SUPPORT, SETTING_KEYS.LOGO] }, this.context)

      content.EN = content.EN.replaceAll('{{{siteName}}}', settings.result.applicationName.value)
      content.EN = content.EN.replaceAll('{{{siteUrl}}}', settings.result.userEndUrl.value)
      content.EN = content.EN.replaceAll('{{{siteLogo}}}', settings.result.logo.value)
      content.EN = content.EN.replaceAll('{{{supportEmailAddress}}}', settings.result.defaultSupport.value)

      const updatedContent = await getLanguageWiseNameJson(content)
      const updatedtitle = await getLanguageWiseNameJson(title)

      page = await this.context.sequelize.models.page.create({
        slug,
        title: updatedtitle,
        content: updatedContent,
        isActive,
        category
      }, { transaction })

      await populatePagesCache(this.context)
      return { page }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
