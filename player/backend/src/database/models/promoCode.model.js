import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'

export default class PromoCode extends ModelBase {
    static model = 'promocode'

    static table = 'promo_codes'

    static options = {
      name: {
        singular: 'promo_code',
        plural: 'promo_codes'
      },
      timestamps: true,
      paranoid: true
    }

    static attributes = {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      promocode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      validTill: {
        type: DataTypes.DATE,
        allowNull: true
      },
      maxUsersAvailed: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      perUserLimit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      isDiscountOnAmount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      discountPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      package: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }

    static associate () {
    }
}
