import CasinoAggregator from './casinoAggregator'
import CasinoCategory from './casinoCategory'
import CasinoGame from './casinoGame'
import CasinoProvider from './casinoProvider'
import CasinoGameCategory from './casinoGameCategory.model'
import { CasinoTransaction } from './casinoTransaction'

/** @type {[typeof import('sequelize').Model]} */
export const models = [
  CasinoGame,
  CasinoProvider,
  CasinoAggregator,
  CasinoTransaction,
  CasinoCategory,
  CasinoGameCategory
]
