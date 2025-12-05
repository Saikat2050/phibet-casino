import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'

export default class GetTierDetail extends ServiceBase {
  async run () {
    const {
      dbModels: { Tier: TierModel }
    } = this.context

    const s3Config = config.getProperties().s3

    const tiers = await TierModel.findAll({
      where: {
        isActive: true
      },
      order: [['level', 'ASC']]
    })

    tiers.map(tier => {
      if (tier.icon) { tier.icon = `${s3Config.S3_DOMAIN_KEY_PREFIX}${tier.icon}` }
    })

    return {
      status: 200,
      success: true,
      tiers
    }
  }
}
