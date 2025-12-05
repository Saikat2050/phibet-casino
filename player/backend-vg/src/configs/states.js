export const statesArray = [
  'Alaska',
  'Alabama',
  'Arkansas',
  'Arizona',
  'California',
  'Colorado',
  'Connecticut',
  'District of Columbia',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Iowa',
  'Illinois',
  'Indiana',
  'Kansas',
  'Louisiana',
  'Massachusetts',
  'Maryland',
  'Maine',
  'Michigan',
  'Minnesota',
  'Missouri',
  'Mississippi',
  'Montana',
  'North Carolina',
  'North Dakota',
  'Nebraska',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Virginia',
  'Vermont',
  'Wisconsin',
  'West Virginia',
  'Wyoming',
  'Nevada',
  'Kentucky'
]

export const excludedStates = [
  'Alabama',
  'Connecticut',
  'Delaware',
  'Idaho',
  'Kentucky',
  'Louisiana',
  'Michigan',
  'Montana',
  'Nevada',
  'Tennessee',
  'Washington',
  'New York',
  'New Jersey'
]

export const allowedStates = statesArray.filter(state => !excludedStates.includes(state))

// Function to map the array back to an object with keys starting from 1
const mapStatesToObject = (states) => {
  return states.reduce((obj, state, index) => {
    obj[index + 1] = state
    return obj
  }, {})
}

export const mappedStates = mapStatesToObject(statesArray)
