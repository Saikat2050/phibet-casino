import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getAll } from '../../utils/crud'
import { Op } from 'sequelize'
export class GetCmsService extends ServiceBase {
  async run () {
    const {
      CmsPage: CmsPageModel
    } = this.context.dbModels

    const cmsData = await getAll({
      model: CmsPageModel,
      data: { isActive: true, category: { [Op.not]: 4 } }
    })

    return { success: true, data: cmsData, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
