'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('jackpots', {
        jackpot_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        jackpot_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        max_ticket_size: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        seed_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        jackpot_pool_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        jackpot_pool_earning: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        entry_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        admin_share: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        pool_share: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        ticket_sold: {
          type: Sequelize.DOUBLE,
          defaultValue: 0,
          allowNull: true
        },
        winning_ticket: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()')
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()')
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true
        }
      }, {
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropTable('user_tasks')
  }
}
