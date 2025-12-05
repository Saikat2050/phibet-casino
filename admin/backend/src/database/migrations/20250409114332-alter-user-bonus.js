'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.changeColumn('user_bonus', 'bonus_id', {
      type: DataTypes.BIGINT,
      allowNull: true,
      fieldName: 'bonusId',
      _modelAttribute: true,
      field: 'bonus_id'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.changeColumn('user_bonus', 'bonus_id', {
      type: DataTypes.BIGINT,
      allowNull: false,
      fieldName: 'bonusId',
      _modelAttribute: true,
      field: 'bonus_id'
    }
    )
  }
}
