'use strict'
import { sequelize } from '@src/database/models'
import { Op } from 'sequelize'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getInternalTag = await sequelize.models.tag.findOne({
      where: { tag: { [Op.iLike]: '%internal%' } },
      attributes: ['id']
    })

    if (getInternalTag) {
      await sequelize.models.tag.update({ tag: 'INTERNAL', isActive: true }, { where: { id: getInternalTag.id } })
    } else {
      await sequelize.models.tag.create({ tag: 'INTERNAL', isActive: true })
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
}
