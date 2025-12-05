import _ from 'lodash'
import { groupsCriteria } from './constants/chat.constants'

export const isContainOffensiveWord = (message, offensiveWords) => {
  const lowerCaseMessage = message.toLowerCase()
  return offensiveWords.some((offensiveWord) => {
    const lowerCaseOffensiveWord = offensiveWord.toLowerCase()
    const wordRegex = new RegExp(`\\b${lowerCaseOffensiveWord}\\b`)
    return wordRegex.test(lowerCaseMessage)
  })
}

export const containsLink = (message) => {
  // Regular expression to match URLs including those starting with www and ending with .com, excluding https://giphy.com
  const urlRegex = /^(?!https?:\/\/(?:www\.)?giphy\.com\/).*\b(?:https?:\/\/(?!giphy\.com(?:\/|$))[^\s/$.?#]+\.[^\s/]+(?!\.com\b)|(?:http?:\/\/(?!giphy\.com(?:\/|$))[^\s/$.?#]+\.[^\s/]+(?!\.com\b))|(?:www\.(?!giphy\.com(?:\/|$))[^\s/$.?#]+\.[^\s/]+(?!\.com\b))|\b\w+\.(?!giphy\.com(?:\/|$))(?:com\b|net\b|org\b|info\b|biz\b|co\.uk\b|org\.uk\b|gov\b|edu\b)\b).*/gi
  // Check if the message contains a URL
  return urlRegex.test(message)
}

/**
 * Checks if user can join the grop based on criteria
 * @param {*} group
 * @param {*} user
 * @returns Boolean
 */
export const checkUserCanJoinGroup = (group = {}, user = {}) => {
  // get criteria
  const criterias = group.criteria || []

  const criteriaCheck = { isRestricted: false, reason: [] }

  // if criteria array is empty
  if (_.isEmpty(criterias)) return criteriaCheck

  // check if user matches all the criterias
  for (const criteria of criterias) {
    if (criteria.key === groupsCriteria.KYC_CRITERIA && criteria.value !== user.kycStatus) {
      criteriaCheck.isRestricted = true
      criteriaCheck.reason.push(groupsCriteria.KYC_CRITERIA)
    }
    if (criteria.key === groupsCriteria.WAGERING_CRITERIA && criteria.value > parseInt(user.totalWager)) {
      criteriaCheck.isRestricted = true
      criteriaCheck.reason.push(groupsCriteria.WAGERING_CRITERIA)
    }
    if (criteria.key === groupsCriteria.RANKING_LEVEL_CRITERIA && criteria.value < user.rankingLevel) {
      criteriaCheck.isRestricted = true
      criteriaCheck.reason.push(groupsCriteria.RANKING_LEVEL_CRITERIA)
    }
  }

  return criteriaCheck
}
