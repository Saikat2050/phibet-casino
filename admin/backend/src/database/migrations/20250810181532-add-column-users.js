module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_jackpot_terms_accepted', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })

    await queryInterface.addColumn('users', 'is_jackpot_opted_in', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })

    await queryInterface.addColumn('users', 'jackpot_multiplier', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'jackpot_multiplier')
    await queryInterface.removeColumn('users', 'is_jackpot_opted_in')
    await queryInterface.removeColumn('users', 'is_jackpot_terms_accepted')
  }
}
