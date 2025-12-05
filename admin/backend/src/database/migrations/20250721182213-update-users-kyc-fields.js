import { KYC_LEVELS } from '@src/utils/constants/public.constants.utils';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = 'users';

      const columnExists = async (columnName) => {
        const [results] = await queryInterface.sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND column_name='${columnName}'`,
          { transaction }
        );
        return results.length > 0;
      };

      const addColumnIfNotExists = async (columnName, options) => {
        const exists = await columnExists(columnName);
        if (!exists) {
          await queryInterface.addColumn(table, columnName, options, { transaction });
        }
      };

      await addColumnIfNotExists('kyc_level', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: KYC_LEVELS.K3
      });

      await addColumnIfNotExists('kyc_verified_at', {
        type: DataTypes.DATE,
        allowNull: true
      });

      await addColumnIfNotExists('kyc_verified_by', {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'admin_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });

      await addColumnIfNotExists('kyc_rejection_reason', {
        type: DataTypes.TEXT,
        allowNull: true
      });

      await addColumnIfNotExists('kyc_metadata', {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
      });

      await addColumnIfNotExists('kyc_last_activity', {
        type: DataTypes.DATE,
        allowNull: true
      });

      const existingIndexes = await queryInterface.showIndex(table, { transaction });

      const addIndexIfNotExists = async (fields, indexName) => {
        const exists = existingIndexes.some(idx => idx.name === indexName);
        if (!exists) {
          await queryInterface.addIndex(table, fields, { name: indexName, transaction });
        }
      };

      await addIndexIfNotExists(['kyc_status'], 'users_kyc_status');
      await addIndexIfNotExists(['kyc_level'], 'users_kyc_level');
      await addIndexIfNotExists(['kyc_verified_at'], 'users_kyc_verified_at');

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = 'users';

      const removeIndexIfExists = async (indexName) => {
        try {
          await queryInterface.removeIndex(table, indexName, { transaction });
        } catch (_) {
          // Ignore if not exists
        }
      };

      await removeIndexIfExists('users_kyc_status');
      await removeIndexIfExists('users_kyc_level');
      await removeIndexIfExists('users_kyc_verified_at');

      const removeColumnIfExists = async (columnName) => {
        const [results] = await queryInterface.sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND column_name='${columnName}'`,
          { transaction }
        );
        if (results.length > 0) {
          await queryInterface.removeColumn(table, columnName, { transaction });
        }
      };

      await removeColumnIfExists('kyc_level');
      await removeColumnIfExists('kyc_verified_at');
      await removeColumnIfExists('kyc_verified_by');
      await removeColumnIfExists('kyc_rejection_reason');
      await removeColumnIfExists('kyc_metadata');
      await removeColumnIfExists('kyc_last_activity');

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
