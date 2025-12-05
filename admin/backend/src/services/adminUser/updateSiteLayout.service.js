import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    siteLayout: {
      type: 'object',
      properties: {
        error: { type: 'string', default: '' },
        isMobile: { type: 'boolean', default: false },
        leftMenu: { type: 'boolean', default: false },
        isLoading: { type: 'boolean', default: true },
        isPreloader: { type: 'boolean', default: false },
        showSidebar: { type: 'boolean', default: false },
        showBreadcrumb: { type: 'boolean', default: false },
        showRightSidebar: { type: 'boolean', default: false },
        layoutType: { enum: ['vertical', 'horizontal'], default: 'vertical' },
        layoutWidth: { enum: ['fluid', 'boxed', 'scrollable'], default: 'fluid' },
        topbarTheme: { enum: ['light', 'dark', 'colored'], default: 'light' },
        layoutModeType: { enum: ['light', 'dark'], default: 'light' },
        leftSideBarType: { enum: ['default', 'compact', 'icon', 'abc'], default: 'default' },
        leftSideBarTheme: { enum: ['light', 'colored', 'dark', 'winter', 'ladylip', 'plumplate', 'strongbliss', 'greatwhale'], default: 'dark' },
        tableHeaderClass: { enum: ['table-light', 'empty'], default: 'table-light' },
        leftSideBarThemeImage: { enum: ['none', 'img1', 'img2', 'img3', 'img4'], default: 'none' }
      }
    }
  },
  required: ['adminUserId']
})

export class UpdateSiteLayoutService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const existingUser = await this.context.sequelize.models.adminUser.findOne({
        where: { id: this.args.adminUserId },
        attributes: ['siteLayout']
      })

      await this.context.sequelize.models.adminUser.update({
        siteLayout: this.args.siteLayout
      }, {
        where: { id: this.args.adminUserId }
      })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: this.args.adminUserId,
        entityType: 'adminUser',
        action: 'update',
        changeTableId: this.args.adminUserId,
        changeTableName: 'admin_users',
        previousData: { siteLayout: existingUser?.siteLayout },
        modifiedData: { siteLayout: this.args.siteLayout },
        service: 'update site layout',
        category: tableCategoriesMapping.admin_users

      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
