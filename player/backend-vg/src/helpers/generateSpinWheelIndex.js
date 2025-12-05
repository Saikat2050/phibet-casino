import Logger from '../libs/logger'

export const generateSpinWheelIndex = async (objects) => {
  try {
    const allowedObjects = objects.filter(obj => obj.isAllow)

    if (allowedObjects.length === 0) {
      // If no allowed objects, return null or handle it according to your needs
      return { object: null, index: -1 }
    }

    // Sort allowed objects based on priorities in descending order
    allowedObjects.sort((a, b) => b.priority - a.priority)

    // Calculate total priority
    const totalPriority = allowedObjects.reduce((sum, obj) => sum + obj.priority, 0)

    // Generate a random number between 0 and totalPriority
    const randomNum = Math.random() * totalPriority

    // Iterate through the allowed objects to find the selected object
    let cumulativePriority = 0
    for (let i = 0; i < allowedObjects.length; i++) {
      const obj = allowedObjects[i]
      cumulativePriority += obj.priority
      if (randomNum < cumulativePriority) {
        return { object: obj, index: objects.indexOf(obj) } // Return the object and its index
      }
    }

    // Fallback: In case of unexpected scenario, return a random object and its index
    const randomObject = allowedObjects[Math.floor(Math.random() * allowedObjects.length)]
    return { object: randomObject, index: objects.indexOf(randomObject) }
  } catch (error) {
    Logger.info(`Error in Generating Spin Wheel Index - ${JSON.stringify(error)}`)
    return false
  }
}
