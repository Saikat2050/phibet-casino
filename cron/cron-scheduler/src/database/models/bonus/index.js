import { Bonus } from './bonus'
import { BonusCurrency } from './bonusCurrency'
import { UserBonus } from './userBonus'

/** @type {[typeof import('sequelize').Model]} */
export const models = [
  Bonus,
  UserBonus,
  BonusCurrency,
]
