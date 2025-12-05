'use strict'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  const levels = [
    { name: 'Level 0', level: 0, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 1', level: 1, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 2', level: 2, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 3', level: 3, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 4', level: 4, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 5', level: 5, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 6', level: 6, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 7', level: 7, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 8', level: 8, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true },
    { name: 'Level 9', level: 9, xpRequirement: 0, tierUpBonus: JSON.stringify({ gc: 0, sc: 0 }), monthlyPercentage: 0, weeklyPercentage: 0, rakebackPercentage: 0, issueSpinWheel: 0, icon: ' ', isActive: true }
  ]

  const transaction = await queryInterface.sequelize.transaction()
  try {
    const levelNames = levels.map(level => level.name)

    // Remove existing levels with the same names
    await queryInterface.bulkDelete(
      'vip_tiers',
      { name: levelNames },
      { transaction }
    )
    const vipLevels = levels.map(level => ({
      name: level.name,
      level: level.level,
      xp_requirement: level.xpRequirement,
      tier_up_bonus: level.tierUpBonus,
      monthly_percentage: level.monthlyPercentage,
      weekly_percentage: level.weeklyPercentage,
      rakeback_percentage: level.rakebackPercentage,
      issue_spin_wheel: level.issueSpinWheel,
      icon: '',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }))

    // Insert new levels
    await queryInterface.bulkInsert('vip_tiers', vipLevels, { transaction })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('vip_tiers', null, {})
}

export { up, down }
