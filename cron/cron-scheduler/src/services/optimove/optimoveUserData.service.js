import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import sftp from '@src/libs/sftp'
import { Logger } from '@src/libs/logger'

export class OptimoveUserDataService extends ServiceBase {
  async run () {
    try {
      const { whereString = '', offset, size, fileName } = this.args.jobData
      let users = []
      console.time('Customers Fetch Time')
      users = await sequelize.query(`
      SELECT
        users.id AS "Player_ID",
        users.unique_id AS "Uuid",
        users.created_at AS "Registered_Date",
        users.email AS "Email",
        users.phone_code::INTEGER AS "Country",
        CONCAT(users.phone_code, users.phone) AS "Mobile_Number",
        users.email_verified AS "Is_Email_Verified",
        users.phone_verified AS "Is_SMS_Verified",
        users.date_of_birth AS "Date_Of_Birth",
        users.username AS "Alias",
        users.gender AS "Gender",
        'USA' AS "Country",
        'USD' AS "Currency",
        users.first_name AS "First_Name",
        users.last_name AS "Last_Name",
        'en-US' AS "Language",
        users.sign_in_method AS "Registered_Platform",
        SUM(CAST(CASE WHEN wallets.currency_id = 1 THEN wallets.amount ELSE 0 END AS DECIMAL)) AS GC_Balance,
        SUM(CAST(CASE WHEN wallets.currency_id != 1 THEN wallets.amount ELSE 0 END AS DECIMAL)) AS SC_Balance,
        SUM(CAST(CASE WHEN wallets.currency_id = 2 THEN wallets.amount ELSE 0 END AS DECIMAL)) AS Bonus_SC_Balance,
        SUM(CAST(CASE WHEN wallets.currency_id = 3 THEN wallets.amount ELSE 0 END AS DECIMAL)) AS Purchase_SC_Balance,
        SUM(CAST(CASE WHEN wallets.currency_id = 4 THEN wallets.amount ELSE 0 END AS DECIMAL)) AS Redeem_SC_Balance,
        users.logged_in_at AS "LoggedInAt",
        users.unique_id AS "UniqueId",
        users.kyc_status AS "KycStatus",
        users.updated_at AS "LastUpdated",
        'Yes' AS "Allow_Email",
        'Yes' AS "Allow_SMS",
        'Yes' AS "Allow_Push",
        users.is_active AS "IsActive",
        users.created_at AS "Is_Optin_Email_Time_Stamp"
      FROM public.users
      INNER JOIN public.wallets ON wallets.user_id = users.id
      WHERE
      NOT EXISTS (
        SELECT 1
        FROM public.user_tags ut
        INNER JOIN public.tags tg ON ut.tag_id = tg.id
        WHERE ut.user_id = users.id
        AND tg.tag = 'INTERNAL'
        AND ut.user_id NOT IN (58, 55)
      )
      ${whereString ?? ''}
      GROUP BY users.id
      ORDER BY users.id ASC
      OFFSET :offset
      LIMIT :limit;
      `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          offset,
          limit: size
        }
      })
      console.timeEnd('Customers Fetch Time')
      console.time('Customers SFTP Upload Time')
      if (sftp) await sftp.uploadFile(Buffer.from(JSON.stringify(users)), fileName)
      else Logger.error(`SFTP not found for Optimove - ${fileName}`)
      console.time('Customers SFTP Upload Time')

      return {
        success: true,
        message: 'Data has sent successfully'
      }
    } catch (error) {
      Logger.error('Optimove User Data Service Error', { message: 'Optimove User Data Service Error', exception: error })
      return { success: false, message: 'Error in Optimove User Data Service', data: null, error }
    }
  }
}
