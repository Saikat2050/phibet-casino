import { sequelize } from '@src/database/models'

export const logAdminActivity = async ({ adminUserId, entityId, entityType, action, changeTableId, changeTableName, previousData, modifiedData, service, category, moreDetails }) => {
  try {
    await sequelize.models.adminActivity.create({
      adminUserId,
      entityId,
      entityType,
      action,
      changeTableId,
      changeTableName,
      previousData,
      modifiedData,
      service,
      category,
      moreDetails,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  } catch (error) {
    console.error(`Failed to log admin activity at ${service}:`, error)
  }
}
