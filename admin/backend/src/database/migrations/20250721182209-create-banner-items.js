'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Check if banners table exists
    const tables = await queryInterface.showAllTables()
    if (!tables.includes('banners')) {
      throw new Error("'banners' table does not exist. Please create it first.")
    }

    // Check if banner_items table exists
    if (!tables.includes('banner_items')) {
      await queryInterface.createTable('banner_items', {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        bannerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'banners',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          field: 'banner_id'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'image_url'
        },
        mobileImageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'mobile_image_url'
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'title'
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description'
        },
        buttonText: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'button_text'
        },
        buttonLink: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'button_link'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active'
          },
        order: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'order'
        },
        
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at'
        }
      }, { schema: 'public' })
    }
  },

  down: async (queryInterface, _) => {
    const tables = await queryInterface.showAllTables()
    if (tables.includes('banner_items')) {
      await queryInterface.dropTable('banner_items', { schema: 'public' })
    }
  }
}