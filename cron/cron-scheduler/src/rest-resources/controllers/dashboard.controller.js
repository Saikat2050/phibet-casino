import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { vipTierUpgradeQueue } from '@src/queues/upgradeTier.queue'
import { VipTierBonusQueue } from '@src/queues/vipTierBonus.queue'
import { withdralRequestQueue } from '@src/queues/withdrawlRequest.queue'
import { cumulativeReportQueue } from '@src/queues/cumulativeReport.queue'
import { optimoveQueue } from '@src/queues/optimove.queue'
import { expireBonusQueue } from '@src/queues/expireBonus.queue'
import { casinoQueue } from '@src/queues/casino.queue'
import { usersQueue } from '@src/queues/users.queue'
import { ScaleoQueue } from '@src/queues/scaleo.queue'
import { idComplyQueue } from '@src/queues/idComply.queue'
import { JackpotQueue } from '@src/queues/jackpot.queue'

/**
 * @export
 * @class DashboardController
 */
export default class DashboardController {
  /**
   * @static
   * @return {object}
   * @memberof DashboardController
   */
  static dashboard () {
    const serverAdapter = new ExpressAdapter()
    createBullBoard({
      queues: [
        new BullAdapter(cumulativeReportQueue),
        new BullAdapter(withdralRequestQueue),
        new BullAdapter(expireBonusQueue),
        new BullAdapter(VipTierBonusQueue),
        new BullAdapter(vipTierUpgradeQueue),
        new BullAdapter(optimoveQueue),
        new BullAdapter(casinoQueue),
        new BullAdapter(usersQueue),
        new BullAdapter(ScaleoQueue),
        new BullAdapter(idComplyQueue),
        new BullAdapter(JackpotQueue)
      ],
      serverAdapter: serverAdapter
    })

    serverAdapter.setBasePath('/dashboard')
    return serverAdapter.getRouter()
  }
}
