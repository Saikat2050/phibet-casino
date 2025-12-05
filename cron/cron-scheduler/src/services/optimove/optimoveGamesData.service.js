import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import sftp from '@src/libs/sftp'
import { Logger } from '@src/libs/logger'

export class OptimoveGamesDataService extends ServiceBase {
  async run () {
    try {
      const { whereString, offset, size, fileName } = this.args.jobData
      let gameDetail = []
      console.time('Games Fetch Time')
      gameDetail = await sequelize.query(`
        SELECT DISTINCT
        ledger.created_at AS "Game_Date",
        casinoTransaction.user_id AS "Player_ID",
        userTable.unique_id AS "Uuid",
        casinoTransaction.game_id AS "Game_ID",
        ledger.purpose AS "Purpose",
        ledger.id AS "Transaction_ID",
        ledger.currency_id AS "Currency_Id",
        CASE
          WHEN ledger.currency_id = 1 THEN 'GC'
          WHEN ledger.currency_id = 2 THEN 'Bonus_SC'
          WHEN ledger.currency_id = 3 THEN 'Purchase_SC'
          WHEN ledger.currency_id = 4 THEN 'Redeem_SC'
          ELSE 'Unknown'
        END AS "Currency",
        CASE WHEN ledger.purpose = 'CasinoBet' AND ledger.currency_id = 1 THEN ledger.amount ELSE NULL END AS "Gold_Coins_Bet_Amount",
        CASE WHEN ledger.purpose = 'CasinoBet' AND ledger.currency_id = 2 THEN ledger.amount ELSE NULL END AS "Bonus_Sweep_Coins_Bet_Amount",
        CASE WHEN ledger.purpose = 'CasinoBet' AND ledger.currency_id IN (3, 4) THEN ledger.amount ELSE NULL END AS "Sweep_Coins_Bet_Amount",
        CASE WHEN ledger.purpose = 'CasinoWin' AND ledger.currency_id = 1 THEN ledger.amount ELSE NULL END AS "Gold_Coins_Win_Amount",
        CASE WHEN ledger.purpose = 'CasinoWin' AND ledger.currency_id = 2 THEN ledger.amount ELSE NULL END AS "Bonus_Sweep_Coins_Win_Amount",
        CASE WHEN ledger.purpose = 'CasinoWin' AND ledger.currency_id = 4 THEN ledger.amount ELSE NULL END AS "Sweep_Coins_Win_Amount",
        CASE WHEN ledger.purpose = 'CasinoBetRollback' AND ledger.currency_id = 1 THEN ledger.amount ELSE NULL END AS "Gold_Coins_Bet_Rollback_Amount",
        CASE WHEN ledger.purpose = 'CasinoBetRollback' AND ledger.currency_id = 2 THEN ledger.amount ELSE NULL END AS "Bonus_Sweep_Coins_Bet_Rollback_Amount",
        CASE WHEN ledger.purpose = 'CasinoBetRollback' AND ledger.currency_id IN (3, 4) THEN ledger.amount ELSE NULL END AS "Sweep_Coins_Bet_Rollback_Amount",
        CASE WHEN ledger.purpose = 'CasinoWinRollback' AND ledger.currency_id = 1 THEN ledger.amount ELSE NULL END AS "Gold_Coins_Win_Rollback_Amount",
        CASE WHEN ledger.purpose = 'CasinoWinRollback' AND ledger.currency_id = 2 THEN ledger.amount ELSE NULL END AS "Bonus_Sweep_Coins_Win_Rollback_Amount",
        CASE WHEN ledger.purpose = 'CasinoWinRollback' AND ledger.currency_id = 4 THEN ledger.amount ELSE NULL END AS "Sweep_Coins_Win_Rollback_Amount"
      FROM public.ledgers AS ledger
      INNER JOIN public.casino_transactions AS casinoTransaction
        ON casinoTransaction.id = ledger.transaction_id
        AND ledger.transaction_type = 'casino'
      INNER JOIN public.users AS userTable
        ON userTable.id = casinoTransaction.user_id
      WHERE ${whereString}
      ORDER BY ledger.id ASC
      OFFSET :offset
      LIMIT :limit
      `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          offset,
          limit: size
        }
      })
      console.timeEnd('Games Fetch Time')
      console.time('Games SFTP Upload Time')
      if (sftp) await sftp.uploadFile(Buffer.from(JSON.stringify(gameDetail)), fileName)
      else Logger.error(`SFTP not found for Optimove - ${fileName}`)
      console.timeEnd('Games SFTP Upload Time')

      return {
        success: true,
        message: 'Data has sent successfully'
      }
    } catch (error) {
      Logger.error('Optimove Game Data Service Error', { message: 'Optimove Game Data Service Error', exception: error })
      return { success: false, message: 'Error in Optimove Game Data Service', data: null, error }
    }
  }
}
