export const isContainOffensiveWord = (message, offensiveWords) => {
  const lowerCaseMessage = message.toLowerCase()
  return offensiveWords.some((offensiveWord) => {
    const lowerCaseOffensiveWord = offensiveWord.toLowerCase()
    const wordRegex = new RegExp(`\\b${lowerCaseOffensiveWord}\\b`)
    return wordRegex.test(lowerCaseMessage)
  })
}
