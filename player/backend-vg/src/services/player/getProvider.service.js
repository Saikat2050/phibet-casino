import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { prepareImageUrl } from '../../utils/common'

export class GetProviderService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      }
    } = this.context
    const providers = await MasterCasinoProviderModel.findAll({
      where: {
        isActive: true
      },
      include: [{
        model: MasterGameAggregatorModel,
        where: {
          isActive: true
        },
        attributes: ['name'],
        required: true
      }],
      order: [['createdAt', 'DESC']]
    })
    Promise.all(
      providers.map((provider, index) => {
        provider.dataValues.isNewProvider = index < 3
        provider.dataValues.thumbnailUrl = prepareImageUrl(provider.thumbnailUrl)
        return provider
      })
    )
    return {
      success: true,
      data: providers,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
