/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} tableName
 * @param {string} columnName
 * @param {Array} values
 * @param {?import('sequelize').Transaction} transaction
 * @param {?string} defaultValue
 * @param {?string} enumName
 */
export async function changeEnumValues (queryInterface, tableName, columnName, values, transaction, defaultValue = null, enumName = `enum_${tableName}_${columnName}`) {
  const internalTransaction = !transaction
  transaction = transaction || await queryInterface.sequelize.transaction()
  const tempEnumName = `${enumName}_temp`

  try {
    // Create temp enum with new values
    await queryInterface.sequelize.query(`CREATE TYPE "${tempEnumName}" AS ENUM ('${values.join("', '")}');`, { transaction })

    // Drop default if new default is provided
    if (defaultValue) await queryInterface.sequelize.query(`ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT;`, { transaction })

    // Change column type to new column type
    await queryInterface.sequelize.query(`ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE ${tempEnumName} USING (${columnName}::text::${tempEnumName});`, { transaction })

    // Drop old enum
    await queryInterface.sequelize.query(`DROP TYPE ${enumName};`, { transaction })

    // Rename temp enum to old enum
    await queryInterface.sequelize.query(`ALTER TYPE ${tempEnumName} RENAME TO ${enumName}`, { transaction })

    if (internalTransaction) await transaction.commit()
  } catch (error) {
    if (internalTransaction) await transaction.rollback()
    throw Error(error)
  }
}
