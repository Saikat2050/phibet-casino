import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export default class Package extends ModelBase {
  static model = 'package'

  static table = 'packages'

  static options = {
    name: {
      singular: 'package',
      plural: 'packages'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    lable: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gcCoin: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    scCoin: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVisibleInStore: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    validTill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customizationSettings: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    maxPurchasePerUser: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discountAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    discountEndDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    //  The price of the package decreases after certain thresholds are met (e.g., after 100 and 500 purchases).
    // rules: [
    //  { threshold: 100, newPrice: 44.99 },  // Price drops after 100 purchases
    //  { threshold: 500, newPrice: 39.99 }   // Further price drop after 500 purchases
    // ]
    pricingTiers: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    bonusId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    giftable: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      default: false,
      allowNull: true
    },
    scBonus: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    gcBonus: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    packagePurchaseNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    welcomePackage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    timer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }
}
