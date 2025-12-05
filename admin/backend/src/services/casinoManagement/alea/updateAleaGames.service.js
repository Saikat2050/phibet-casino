import { APIError } from '@src/errors/api.error'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'

/**
 * update all the alea games service
 */
export class UpdateAleaGamesService extends ServiceBase {
  async run () {
    /** @type {Language[]} */

    const { args: { data, languages }, context: { models: { casinoGame: casinoGameModel } } } = this

    try {
      await Promise.all(data.map(async (game) => {
        try {
          const { id, name, assetsLink, demoAvailable, thumbnailLinks, rtp, volatility, ...moreDetails } = game

          // update all the games
          await casinoGameModel.update({
            name: this.getNames(languages, name),
            wageringContribution: 0,
            desktopImageUrl: assetsLink,
            mobileImageUrl: assetsLink,
            demoAvailable: demoAvailable,
            thumbnailUrl: thumbnailLinks,
            returnToPlayer: rtp,
            volatilityRating: volatility,
            moreDetails
          }, { where: { uniqueId: id } })
        } catch (error) {
          Logger.log(`do not update unique id ${game.id}`)
        }
      }))

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }

  /**
     * @param {Language[]} languages
     * @param {string} defaultName
     */
  getNames (languages, defaultName) {
    return languages.reduce((prev, language) => {
      prev[language.code] = defaultName
      return prev
    }, {})
  }
}
