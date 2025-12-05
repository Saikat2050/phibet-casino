import { CasinoTournament } from './casinoTournaments'
import { UserTournament } from './userTournaments'
import { TournamentTransaction } from './tournamentTransactions'
import { TournamentPrize } from './tournamentPrize'
import { CasinoTournamentGame } from './casinoTournamentGame'
import { TournamentCurrency } from './tournamentCurrency'

/** @type {[typeof import('sequelize').Model]} */
export const models = [
  CasinoTournament,
  UserTournament,
  TournamentTransaction,
  TournamentCurrency,
  TournamentPrize,
  CasinoTournamentGame
]
