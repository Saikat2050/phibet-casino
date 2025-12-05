import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class BannerItem extends ModelBase {
  static model = 'bannerItem'

  static table = 'banner_items'

  static options = {
    name: {
      singular: 'banner_item',
      plural: 'banner_items'
    }
  }

  static attributes = {
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
  }

  static associate (models) {
    this.belongsTo(models.banner, { foreignKey: 'bannerId', as: 'banner', onDelete: 'CASCADE' })
    super.associate()
  }
}
