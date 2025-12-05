import { client } from '@src/libs/redis'

/**
 * @function getCachedData
 * @param {string} cacheKey - cacheKey
 * @returns {Promise} When resolved giving cache value for given key
 */
export const getCachedData = async (cacheKey) => {
  return await client.get(cacheKey)
}

/**
 * @function removeData
 * @param {string} cacheKey - cacheKey
 */
export const removeData = async (cacheKey) => {
  await client.del(cacheKey)
}
/**
 * @function setData
 * @param {string} cacheKey - key to be set in cache
 * @param {string} value - value for particular key
 * @param {integer} expiryTime - expiryTime in seconds
 */
export const setData = async (cacheKey, value, expiryTime) => {
  value = JSON.stringify(value)
  if (expiryTime && expiryTime > 0) {
    await client.set(cacheKey, value, 'EX', expiryTime)
  } else await client.set(cacheKey, value)
}


/**
 * @function getTTL
 * @param {string} cacheKey - key to be set in cache
 * @description function to get time to leave
 */
export const getTTL = async (cacheKey) => {
  return await client.ttl(cacheKey)
}

