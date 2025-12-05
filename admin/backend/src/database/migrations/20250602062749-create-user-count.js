'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable(
      'player_counts',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        count: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        createdAt: {
          allowNull: true,
          type: DataTypes.DATE,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'updatedAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      },
      { schema: 'public' }
    )

    await queryInterface.addColumn('casino_games', 'landing_page', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'landingPage',
      _modelAttribute: true,
      field: 'landing_page',
      defaultValue: false
    })

    await queryInterface.sequelize.query(`
      ALTER SEQUENCE "users_id_seq" RESTART WITH 1000;
    `)
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('casino_games', 'landing_page')
    return queryInterface.dropTable('segmentation', { schema: 'public' })
  }
}
