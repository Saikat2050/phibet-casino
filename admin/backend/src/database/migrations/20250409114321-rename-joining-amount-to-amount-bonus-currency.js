
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('bonus_currencies', 'joining_amount', 'amount')
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('bonus_currencies', 'joining_amount', 'amount')
  }
}
