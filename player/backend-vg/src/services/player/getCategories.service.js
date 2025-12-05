import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getAll } from '../../utils/crud'
export class GetCategoriesService extends ServiceBase {
  async run () {
    const {
      MasterGameCategory: MasterGameCategoryModel
    } = this.context.dbModels

    const categoriesData = await getAll({
      model: MasterGameCategoryModel,
      data: { isActive: true },
      order: [['orderId', 'ASC']]
    })

    return { success: true, data: categoriesData, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
