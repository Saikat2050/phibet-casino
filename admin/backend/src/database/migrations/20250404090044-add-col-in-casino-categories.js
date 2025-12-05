'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('casino_categories', 'is_sidebar', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        fieldName: 'isSidebar',
        _modelAttribute: true,
        field: 'is_sidebar'
      }),

      queryInterface.addColumn('casino_categories', 'is_lobby_page', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        fieldName: 'isLobbyPage',
        _modelAttribute: true,
        field: 'is_lobby_page'
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('casino_categories', 'is_sidebar'),
      queryInterface.removeColumn('casino_categories', 'is_lobby_page')
    ])
  }
}
