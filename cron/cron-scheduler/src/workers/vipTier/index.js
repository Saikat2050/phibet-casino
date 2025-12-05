import { JOB_PROCESS_VIP_TIER_UPGRADE_DATA, vipTierUpgradeQueue } from '@src/queues/upgradeTier.queue'
import { JOB_PROCESS_MONTHLY_BONUS_DATA, JOB_PROCESS_RAKEBACK_BONUS_DATA, JOB_PROCESS_WEEKLY_BONUS_DATA, VipTierBonusQueue } from '@src/queues/vipTierBonus.queue'
import path from 'path'

vipTierUpgradeQueue.process(JOB_PROCESS_VIP_TIER_UPGRADE_DATA, 3, path.join(__dirname, './vipTier.worker.js'))
// VipTierBonusQueue.process(JOB_PROCESS_WEEKLY_BONUS_DATA, 1, path.join(__dirname, 'weeklyBonus.worker.js'))
VipTierBonusQueue.process(JOB_PROCESS_MONTHLY_BONUS_DATA, 1, path.join(__dirname, './monthlyBonus.worker.js'))
VipTierBonusQueue.process(JOB_PROCESS_RAKEBACK_BONUS_DATA, 1, path.join(__dirname, './rakebackBonus.worker.js'))
