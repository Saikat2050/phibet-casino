'use strict'
import { sequelize } from '@src/database/models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getCountryId = await sequelize.models.country.findOne({
      where: { code: 'US' },
      attributes: ['id']
    })

    const data = [
      {
        name: 'Alaska',
        code: 'AK',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Alabama',
        code: 'AL',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Arkansas',
        code: 'AS',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Arizona',
        code: 'AZ',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'California',
        code: 'CA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Colorado',
        code: 'CO',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Connecticut',
        code: 'CT',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'District of Columbia',
        code: 'DC',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Delaware',
        code: 'DE',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Florida',
        code: 'FL',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Georgia',
        code: 'GA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hawaii',
        code: 'HI',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Iowa',
        code: 'IA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Idaho',
        code: 'ID',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Illinois',
        code: 'IL',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Indiana',
        code: 'IN',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kansas',
        code: 'KS',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kentucky',
        code: 'KY',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Louisiana',
        code: 'LA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Massachusetts',
        code: 'MA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Maryland',
        code: 'MD',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Maine',
        code: 'ME',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Michigan',
        code: 'MI',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Minnesota',
        code: 'MN',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Missouri',
        code: 'MO',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mississippi',
        code: 'MS',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Montana',
        code: 'MT',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'North Carolina',
        code: 'NC',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'North Dakota',
        code: 'ND',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nebraska',
        code: 'NE',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New Hampshire',
        code: 'NH',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New Jersey',
        code: 'NJ',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New Mexico',
        code: 'NM',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nevada',
        code: 'NV',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New York',
        code: 'NY',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ohio',
        code: 'OH',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oklahoma',
        code: 'OK',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oregon',
        code: 'OR',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pennsylvania',
        code: 'PA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Rhode Island',
        code: 'PI',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'South Carolina',
        code: 'SC',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'South Dakota',
        code: 'SD',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Tennessee',
        code: 'TN',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Texas',
        code: 'TX',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Utah',
        code: 'UT',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Virginia',
        code: 'VA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Vermont',
        code: 'VT',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Washington',
        code: 'WA',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Wisconsin',
        code: 'WI',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'West Virginia',
        code: 'WV',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Wyoming',
        code: 'WY',
        countryId: getCountryId.id,
        created_at: new Date(),
        updated_at: new Date()
      }

    ]
    await sequelize.models.state.bulkCreate(data, {
      updateOnDuplicate: ['name']
    })
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('state', null, {})
    } catch (error) {
    }
  }
}
