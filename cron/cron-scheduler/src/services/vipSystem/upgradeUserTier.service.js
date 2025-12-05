import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { TierUpBonusService } from './tierUpBonus.service'
import { Logger } from '@src/libs/logger'

export class UpgradeUserTierService extends ServiceBase {
  async run () {
    const transaction = await sequelize.transaction()
    try {
      const { userId, currentVipTier, nextVipTier } = this.args
      const userDetails = await sequelize.models.user.findOne({
        where: { id: +userId },
        attributes: ['id']
      })

      if (!userDetails) {
        await transaction.rollback()
        return
      }

      await sequelize.models.userVipTier.update({ isActive: false }, {
        where: { vipLevelId: currentVipTier.id, isActive: true, userId: userId },
        transaction
      })

      await sequelize.models.userVipTier.create({
        userId: userDetails.id,
        vipLevelId: nextVipTier?.id,
        isActive: true
      }, { transaction })

      if (nextVipTier.tierUpBonus) {
        const gcCoins = nextVipTier.tierUpBonus.gc
        const scCoins = nextVipTier.tierUpBonus.sc
        await TierUpBonusService.run({ userId, gcCoins, scCoins, seqTransaction: transaction })
      }

      await transaction.commit()
      return { success: true }
    } catch (error) {
      await transaction.rollback()
      Logger.error('Tier upgrade service', { message: 'Tier upgrade service', exception: error })
      return { success: false, message: 'Error in upgrade tier Service', data: null, error }
    }
  }
}
