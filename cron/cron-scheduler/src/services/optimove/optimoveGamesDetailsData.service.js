import { sequelize } from '@src/database'
import { ServiceBase } from '@src/libs/serviceBase'
import sftp from '@src/libs/sftp'
import { Logger } from '@src/libs/logger'

export class OptimoveGamesDetailsDataService extends ServiceBase {
  async run () {
    try {
      const { whereString = '', offset, size, fileName } = this.args.jobData
      let gamesDetails = []
      console.time('Game_Types_and_Categories Fetch Time')
      const whereClause = whereString ? `WHERE ${whereString}` : ''
      gamesDetails = await sequelize.query(`
      SELECT
        cg.id as "Game_ID",
        cg.name->>'EN' AS "Game_Name",
        cp.name->>'EN' AS "Provider_Name",
        cc.name->>'EN' AS "Game_Category"
      FROM public.casino_games AS cg
      INNER JOIN public.casino_providers AS cp
      ON cg.casino_provider_id = cp.id
      INNER JOIN public.casino_categories AS cc
      ON cg.casino_category_id = cc.id
      ${whereClause}
      OFFSET :offset
      LIMIT :limit
      `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          offset,
          limit: size
        }
      })
      console.timeEnd('Game_Types_and_Categories Fetch Time')
      console.time('Game_Types_and_Categories SFTP Upload Time')
      if (sftp) await sftp.uploadFile(Buffer.from(JSON.stringify(gamesDetails)), fileName)
      else Logger.error(`SFTP not found for Optimove - ${fileName}`)
      console.timeEnd('Game_Types_and_Categories SFTP Upload Time')

      return {
        success: true,
        message: 'Data has sent successfully'
      }
    } catch (error) {
      Logger.error('Optimove Game Details Data Service Error', { message: 'Optimove Game Details Data Service Error', exception: error })
      return { success: false, message: 'Error in Game Details Data Service', data: null, error }
    }
  }
}
