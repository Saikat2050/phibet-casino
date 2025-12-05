'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('vip_tiers', 'cashback_monthly_limit', {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue:100
    })

    await queryInterface.addColumn('vip_tiers', 'rakeback_monthly_limit', {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 100

    })
  },

  down: async (queryInterface, _) => {
    await queryInterface.removeColumn('vip_tiers', 'cashback_monthly_limit')
    await queryInterface.removeColumn('vip_tiers', 'rakeback_monthly_limit')
  }
}
