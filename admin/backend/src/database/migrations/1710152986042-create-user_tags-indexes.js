module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.user_tags', {
        unique: true,
        fields: ['user_id', 'tag_id'],
        type: '',
        parser: null,
        name: 'user_tags_user_id_tag_id'
      })
    ])
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await Promise.all([
      queryInterface.removeIndex('public.user_tags', 'user_tags_user_id_tag_id')
    ])
  }
}
