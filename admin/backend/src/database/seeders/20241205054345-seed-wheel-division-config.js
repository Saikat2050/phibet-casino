'use strict'

async function up (queryInterface, Sequelize) {
  const data = [
    {
      sc: 0,
      gc: 0,
      is_allow: true,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sc: 0,
      gc: 0,
      is_allow: false,
      player_limit: null,
      priority: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]

  await queryInterface.bulkInsert('wheel_division_configurations', data, {})
}

async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('wheel_division_configurations', null, {})
}

export { down, up }
