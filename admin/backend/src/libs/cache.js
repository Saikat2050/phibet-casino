import { client } from '@src/libs/redis'
import { CACHE_STORE_PREFIXES } from '@src/utils/constants/app.constants'

export class Cache {
  static #cachePrefix = CACHE_STORE_PREFIXES.BACKEND_CACHE
  static #getKey = (key) => `${this.#cachePrefix}${key}`

  /**
   * Set a value in Redis with an optional expiration time.
   * @param {string} key - The key under which the value is stored.
   * @param {any} value - The value to store.
   * @param {number} [expiration] - The expiration time in seconds.
   * @returns
   */
  static async set (key, value, expiration) {
    const args = [this.#getKey(key), JSON.stringify(value)]
    if (expiration) {
      args.push('EX', expiration)
    }
    return await client.set(...args)
  }

  /**
   * @param {string} key
   * @returns
   */
  static async get (key) {
    const data = await client.get(this.#getKey(key))
    return JSON.parse(data || '{}')
  }

  /**
   * @param {string} key
   * @returns
   */
  static del (key) {
    return client.del(this.#getKey(key))
  }

  /**
   * @returns {Array}
   */
  static async keys (key) {
    if (key) return await client.keys(`${key}*`)
    const keys = await client.keys('*').map(key => key.includes(this.#cachePrefix))
    return keys
  }

  static async destroyOldSessions (userId) {
    const keys = await client.keys(`${CACHE_STORE_PREFIXES.SESSION}*:${userId}`)
    if (keys.length) await client.del(keys)
  }
}
