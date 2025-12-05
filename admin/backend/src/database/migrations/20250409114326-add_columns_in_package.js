'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('packages', 'is_featured', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
    await queryInterface.addColumn('packages', 'sc_bonus', {
      type: DataTypes.DOUBLE,
      allowNull: true
    })
    await queryInterface.addColumn('packages', 'gc_bonus', {
      type: DataTypes.DOUBLE,
      allowNull: true
    })
    await queryInterface.addColumn('packages', 'package_purchase_number', {
      type: DataTypes.INTEGER,
      allowNull: true
    })
    await queryInterface.addColumn('packages', 'welcome_package', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
    await queryInterface.addColumn('packages', 'timer', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('packages', 'is_featured')
    await queryInterface.removeColumn('packages', 'sc_bonus')
    await queryInterface.removeColumn('packages', 'gc_bonus')
    await queryInterface.removeColumn('packages', 'package_purchase_number')
    await queryInterface.removeColumn('packages', 'welcome_package')
    await queryInterface.removeColumn('packages', 'timer')
  }
}
