export const validateDates = async (startDate, endDate, registrationEndDate) => {
  if (startDate >= endDate) return false
  if (registrationEndDate > endDate) return false
  if (registrationEndDate <= startDate) return false
  return true
}

export const validatePrizeData = async (prizes) => {
  for (const prize of prizes) {
    console.log(prize)
  }
  return true
}
