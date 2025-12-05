import { appConfig } from '@src/configs'
import { aleaCasinoConfig } from '@src/configs/alea.config'
import { ServiceBase } from '@src/libs/serviceBase'
import axios from 'axios'
import { LoadAleaGamesService } from './loadAleaGames.service'
import { Logger } from '@src/libs/logger'

export class AleaGetPagesService extends ServiceBase {
  async run () {
    const languages = this.args.languages
    let pageDetails, totalPages
    const env = appConfig.env !== 'production' ? 'gamesAvailable' : 'gamesReady'

    const queryPageDetails = JSON.stringify({
      query: `{
        ${env}(jurisdictionCode: "CAO", size: 500) {
          page {
            number
            size
            totalPages
            totalElements
          }
        }
      }`,
      variables: {}
    })

    const options = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://customer-api.aleaplay.com/api/graphql',
      headers: {
        Authorization: `Bearer ${aleaCasinoConfig.authToken}`,
        'Alea-CasinoId': aleaCasinoConfig.casinoId,
        'Content-Type': 'application/json'
      },
      data: queryPageDetails
    }

    try {
      // Fetching initial page details
      const response = await axios(options)
      if (response.status !== 200 || !response.data?.data) {
        Logger.error('Error in getting games details.')
        return this.addError('ThirdPartyApiErrorType')
      }

      pageDetails = env === 'gamesAvailable' ? response.data.data.gamesAvailable.page : response.data.data.gamesReady.page
      totalPages = pageDetails.totalPages

      Logger.info(`Successfully fetched games data initially with length - ${JSON.stringify(response.data)}`)

      const data = []

      // Fetching game data for all pages in parallel
      try {
        const pageRequests = Array.from({ length: totalPages }, async (_, i) => {
          try {
            const queryGames = JSON.stringify({
              query: `{
                ${env}(jurisdictionCode: "CAO", size: 500, page: ${i}) {
                  results {
                    id
                    name
                    software {
                      id
                      name
                    }
                    type
                    status
                    genre
                    jackpot
                    freeSpinsCurrencies
                    ratio
                    rtp
                    volatility
                    minBet
                    maxBet
                    maxExposure
                    maxWinMultiplier
                    lines
                    hitFrequency
                    buyFeature
                    releaseDate
                    features
                    assetsLink
                    thumbnailLinks
                    demoAvailable
                    jackpot
                  }
                }
              }`,
              variables: {}
            })

            const pageOptions = { ...options, data: queryGames }
            const pageResponse = await axios(pageOptions)

            if (pageResponse.status === 200) {
              const gamesData = pageResponse.data?.data
              return env === 'gamesAvailable' ? gamesData.gamesAvailable.results : gamesData.gamesReady.results
            } else {
              Logger.error(`Error fetching page ${i}`)
              return []
            }
          } catch (error) {
            Logger.error(`Error while getting games for page ${i}: ${error}`)
            return []
          }
        })

        const results = (await Promise.all(pageRequests)).flat()
        data.push(...results)

        Logger.info(`Successfully fetched all game data. Total records: ${results.length}`)
      } catch (error) {
        Logger.error(`Unexpected error while fetching games: ${error}`)
      }

      await LoadAleaGamesService.execute({ data, languages }, this.context)

      return { success: true }
    } catch (error) {
      Logger.error(`Error in Get Alea Games service - ${error}`)
      return this.addError('ThirdPartyApiErrorType')
    }
  }
}
