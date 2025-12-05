'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('amoentries', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        fieldName: 'id',
        _modelAttribute: true,
        field: 'id'
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        fieldName: 'userId',
        _modelAttribute: true,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
            table: 'users',
            name: 'user',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'CASCADE'
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        fieldName: 'postalCode',
        _modelAttribute: true,
        field: 'postal_code'
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        fieldName: 'country',
        _modelAttribute: true,
        field: 'country'
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        fieldName: 'entryDate',
        _modelAttribute: true,
        field: 'entry_date'
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        fieldName: 'isValid',
        _modelAttribute: true,
        field: 'is_valid'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'createdAt',
        _modelAttribute: true,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'updateddAt',
        _modelAttribute: true,
        field: 'updated_at'
      },
    });
  },

  down: async (queryInterface, _) => {
    return queryInterface.dropTable('amoentries');
  }
};
