import moment from 'moment'
import { Op } from 'sequelize'
import sftp from '@src/libs/sftp'
import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import { optimoveQueue, JOB_UPDATE_OPTIMOVE_DATA } from '@src/queues/optimove.queue'

const size = 100000
export class ProvideDataService extends ServiceBase {
  async run () {
    try {
      // for sending them test user data we r using static user id 58 and 55
      const { sendResponse = false, fileType } = this.args.jobData
      const data = {}

      if (fileType) {
        switch (fileType.toLowerCase()) {
          case 'gamesdetails':
            data.gamesDetails = await this.gameDetailsData(sftp)
            break
          case 'games':
            data.games = await this.gamesData(sftp)
            break
          case 'transactions':
            data.transactions = await this.transactionData(sftp)
            break
          case 'customer':
            data.customer = await this.customerData(sftp)
            break
          default:
            return {
              success: false,
              message: 'Invalid fileType provided'
            }
        }
      } else {
        data.transactions = await this.transactionData(sftp)
        data.games = await this.gamesData(sftp)
        data.customer = await this.customerData(sftp)
        data.gamesDetails = await this.gameDetailsData(sftp)
      }

      return {
        success: true,
        data: sendResponse ? data : {},
        message: 'Data has sent successfully'
      }
    } catch (error) {
    }
  }

  // customer Data function
  async customerData (sftp) {
    const { start, end } = this.args.jobData
    const date = start ? moment(new Date(start)).format('YYYYMMDD') : moment().subtract(1, 'days').format('YYYYMMDD')

    let whereObj = {}
    let whereString = ''

    if (start && end) {
      whereObj = {
        createdAt: {
          [Op.lte]: end
        }
      }
      const endDate = new Date(end)
      whereString = `AND users.created_at <= '${endDate.toISOString()}'`
    }
    try {
      let offset = 0
      const count = await sequelize.models.user.count({
        where: {
          ...whereObj,
          [Op.and]: [
            sequelize.literal(`
            NOT EXISTS (
              SELECT 1 FROM public.user_tags ut
              INNER JOIN public.tags tg ON ut.tag_id = tg.id
              WHERE ut.user_id = "user".id
              AND tg.tag = 'INTERNAL'
              AND ut.user_id NOT IN (58, 55)
            )
          `)
          ]
        }
      })

      let pages = Math.ceil(count / size)
      const totalPages = Math.ceil(count / size)

      while (pages > 0) {
        pages--

        const fileName = start ? `/Customers_${totalPages - pages}_${moment(new Date(start)).format('YYYYMMDD')}.json` : `/Customers_${totalPages - pages}_${date}.json`

        optimoveQueue.add(
          JOB_UPDATE_OPTIMOVE_DATA,
          { type: 'CUSTOMER_DATA', whereString, offset, size, fileName },
          {
            priority: 1,
            timeout: 3600000
          }
        )
        offset += size
      }
      if (totalPages === 0) await sftp.uploadFile(Buffer.from(JSON.stringify([])), `/Customers_1_${date}.json`)

      return true
    } catch (error) {
      console.log('Error while fetching Customer Data => ', error)
    }
  }

  // Game data function
  async gamesData (sftp) {
    const { start, end } = this.args.jobData

    try {
      const date = start ? new Date(start) : new Date(moment().subtract(1, 'days'))
      const startDate = start ? new Date(start) : moment().subtract(1, 'days').startOf('day').toDate()
      const endDate = end ? new Date(new Date(end).setHours(23, 59, 59, 999)) : moment().subtract(1, 'days').endOf('day').toDate()
      let offset = 0

      const whereString = `
        ledger.purpose IN ('CasinoBet', 'CasinoWin', 'CasinoBetRollback', 'CasinoWinRollback')
        AND ledger.created_at >= '${startDate.toISOString()}'
        AND ledger.created_at <= '${endDate.toISOString()}'
        AND casinoTransaction.created_at >= '${startDate.toISOString()}'
        AND casinoTransaction.created_at <= '${endDate.toISOString()}'
        AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = casinoTransaction.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.user_id NOT IN (58, 55)
        )
      `

      const count = +(await sequelize.query(`
        SELECT COUNT(ledger.id) AS count
        FROM public.ledgers AS ledger
        INNER JOIN public.casino_transactions AS casinoTransaction
        ON casinoTransaction.id = ledger.transaction_id
        AND ledger.transaction_type = 'casino'
        INNER JOIN public.users AS userTable
        ON userTable.id = casinoTransaction.user_id
        WHERE ${whereString};
      `, {
        type: sequelize.QueryTypes.SELECT
      }))[0]?.count

      let pages = Math.ceil(count / size)
      const totalPages = Math.ceil(count / size)

      while (pages > 0) {
        pages--

        const fileName = `/Games_${totalPages - pages}_${date.toISOString().substring(0, 10).replaceAll('-', '')}.json`

        optimoveQueue.add(
          JOB_UPDATE_OPTIMOVE_DATA,
          { type: 'GAMES_DATA', whereString, offset, size, fileName },
          {
            priority: 1,
            timeout: 3600000
          })
        offset += size
      }

      if (totalPages === 0) sftp.uploadFile(Buffer.from(JSON.stringify([])), `/Games_1_${date.toISOString().substring(0, 10).replaceAll('-', '')}.json`)

      return true
    } catch (error) {
      console.log('Error While fetching Casino Games Data', error)
    }
  }

  // Transaction data function
  async transactionData (sftp) {
    const { start, end } = this.args.jobData
    try {
      const date = start ? new Date(start) : new Date(moment().subtract(1, 'days'))
      const startDate = start ? new Date(start) : moment().subtract(1, 'days').startOf('day').toDate()
      const endDate = end ? new Date(new Date(end).setHours(23, 59, 59, 999)) : moment().subtract(1, 'days').endOf('day').toDate()

      const whereString = `
        ledger.purpose NOT IN ('CasinoBet', 'CasinoWin', 'CasinoBetRollback', 'CasinoWinRollback')
        AND transactions.updated_at >= '${startDate.toISOString()}'
        AND transactions.updated_at <= '${endDate.toISOString()}'
        AND NOT EXISTS (
          SELECT 1
          FROM public.user_tags ut
          INNER JOIN public.tags tg ON ut.tag_id = tg.id
          WHERE ut.user_id = transactions.user_id
          AND tg.tag = 'INTERNAL'
          AND ut.user_id NOT IN (58, 55)
        )
      `

      let offset = 0

      const count = +(await sequelize.query(`
        SELECT COUNT(ledger.id) AS count
        FROM public.ledgers AS ledger
        INNER JOIN public.transactions AS transactions
        ON transactions.id = ledger.transaction_id
        AND ledger.transaction_type != 'casino'
        INNER JOIN public.users AS userTable
        ON userTable.id = transactions.user_id
        WHERE ${whereString};
      `, {
        type: sequelize.QueryTypes.SELECT
      }))[0]?.count

      let pages = Math.ceil(count / size)
      const totalPages = Math.ceil(count / size)

      while (pages > 0) {
        pages--
        const fileName = `/Transactions_${totalPages - pages}_${date.toISOString().substring(0, 10).replaceAll('-', '')}.json`
        optimoveQueue.add(
          JOB_UPDATE_OPTIMOVE_DATA,
          { type: 'TRANSACTION_DATA', whereString, offset, size, fileName },
          {
            priority: 1,
            timeout: 3600000
          })
        offset += size
      }

      if (totalPages === 0) sftp.uploadFile(Buffer.from(JSON.stringify([])), `/Transactions_1_${date.toISOString().substring(0, 10).replaceAll('-', '')}.json`)

      return true
    } catch (error) {
      console.log('Error While fetching Transaction Data', error)
    }
  }

  // Game Details data function
  async gameDetailsData (sftp) {
    const { start } = this.args.jobData

    try {
      const date = start ? new Date(start) : new Date(moment().subtract(1, 'days'))

      let offset = 0

      const count = +(await sequelize.query(`
        SELECT count(cg.id) AS count
        FROM public.casino_games AS cg
        INNER JOIN public.casino_providers AS cp
          ON cg.casino_provider_id = cp.id
        INNER JOIN public.casino_categories AS cc
          ON cg.casino_category_id = cc.id;
      `, {
        type: sequelize.QueryTypes.SELECT
      }))[0]?.count

      let pages = Math.ceil(count / size)
      const totalPages = Math.ceil(count / size)

      while (pages > 0) {
        pages--
        const fileName = `/Game_Types_and_Categories_${totalPages - pages}_${date.toISOString().substring(0, 10).replaceAll('-', '')}.json`
        optimoveQueue.add(
          JOB_UPDATE_OPTIMOVE_DATA,
          { type: 'GAMES_DETAILS_DATA', offset, size, fileName },
          {
            priority: 1,
            timeout: 3600000
          })
        offset += size
      }

      if (totalPages === 0) sftp.uploadFile(Buffer.from(JSON.stringify([])), `/Game_Types_and_Categories_1_${date.toISOString().substring(0, 10).replaceAll('-', '')}.json`)

      return true
    } catch (error) {
      console.log('Error While fetching Games Details Data', error)
    }
  }
}
