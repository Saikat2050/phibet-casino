'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
async function up (queryInterface, Sequelize) {
  const now = new Date().toISOString()

  await queryInterface.sequelize.query(`
    INSERT INTO casino_aggregators (id, unique_id, name, created_at, updated_at)
    VALUES
      (1,1,'{  "DE": "alea",  "DU": "alea",  "EN": "alea",  "ES": "alea",  "FI": "alea",  "FR": "alea",  "IT": "alea",  "JA": "alea",  "PT": "alea" }', '${now}', '${now}' ),
      (2,2,'{  "DE": "iconic21",  "DU": "iconic21",  "EN": "iconic21",  "ES": "iconic21",  "FI": "iconic21",  "FR": "iconic21",  "IT": "iconic21",  "JA": "iconic21",  "PT": "iconic21"}','${now}','${now}' )
    ON CONFLICT (id) DO UPDATE
    SET
      unique_id = EXCLUDED.unique_id,
      name = EXCLUDED.name,
      updated_at = '${now}';
  `)
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
}

export { down, up }
