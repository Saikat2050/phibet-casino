import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import sftp from '@src/libs/sftp'
import { Logger } from '@src/libs/logger'

export class OptimoveTransactionDataService extends ServiceBase {
  async run () {
    try {
      const { whereString = '', offset, size, fileName } = this.args.jobData
      let transactionDetails = []
      console.time('Transactions Fetch Time')
      transactionDetails = await sequelize.query(`
      SELECT DISTINCT
        ledger.id AS "Transaction_ID",
        transactions.user_id AS "Player_ID",
        userTable.unique_id AS "Uuid",
        transactions.created_at AS "Transaction_Date",
        transactions.updated_at AS "Last_Updated",
        ledger.purpose AS "Transaction_Type",
        ledger.amount AS "Transaction_Amount",
        transactions.status AS "Status",
        ledger.currency_id AS "Currency_Id",
        CASE
          WHEN ledger.currency_id = 1 THEN 'GC'
          WHEN ledger.currency_id = 2 THEN 'Bonus_SC'
          WHEN ledger.currency_id = 3 THEN 'Purchase_SC'
          WHEN ledger.currency_id = 4 THEN 'Redeem_SC'
          ELSE 'Unknown'
        END AS "Currency"
        FROM public.ledgers AS ledger
        INNER JOIN public.transactions AS transactions
        ON transactions.id = ledger.transaction_id
        AND ledger.transaction_type != 'casino'
        INNER JOIN public.users AS userTable
        ON userTable.id = transactions.user_id
      WHERE
        ${whereString ?? ''}
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
      console.timeEnd('Transactions Fetch Time')
      console.time('Transactions SFTP Upload Time')
      if (sftp) await sftp.uploadFile(Buffer.from(JSON.stringify(transactionDetails)), fileName)
      else Logger.error(`SFTP not found for Optimove - ${fileName}`)
      console.timeEnd('Transactions SFTP Upload Time')

      return {
        success: true,
        message: 'Data has sent successfully'
      }
    } catch (error) {
      Logger.error('Optimove Transaction Data Service Error', { message: 'Optimove Transaction Data Service Error', exception: error })
      return { success: false, message: 'Error in Transaction User Data Service', data: null, error }
    }
  }
}
