import { models as bonusModels } from './bonus'
import { models as casinoModels } from './casino'
import { models as publicModels } from './public'
import { models as tournamentModels } from './tournaments'
import { models as paymentModels } from './payment'
import { models as vipSystemModels } from './vipSystem'

/** @type {[typeof import('sequelize').Model]} */
export const models = [...publicModels, ...casinoModels, ...bonusModels, ...tournamentModels, ...paymentModels, ...vipSystemModels]
