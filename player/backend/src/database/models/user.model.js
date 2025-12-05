import { KYC_LEVELS, KYC_STATUS, SIGN_IN_METHOD, USER_GENDER } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class User extends ModelBase {
  static model = 'user'

  static table = 'users'

  static options = {
    name: {
      singular: 'user',
      plural: 'users'
    }
  }

  static jsonSchemaOptions = {
    exclude: ['password']
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    languageId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM(Object.values(USER_GENDER)),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    lastLoggedInIp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loggedInAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    kycStatus: {
      type: DataTypes.ENUM(Object.values(KYC_STATUS)),
      allowNull: true,
      defaultValue: 'PENDING'
    },
    kycLevel: {
      type: DataTypes.ENUM(Object.values(KYC_LEVELS)),
      allowNull: false,
      defaultValue: KYC_LEVELS.LEVEL_3
    },
    kycVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    kycVerifiedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    kycRejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kycMetadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    kycLastActivity: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    countryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    sessionLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referredBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    newOtpRequested: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paysafeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uniqueId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    scWaggeredAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    signInMethod: {
      allowNull: true,
      type: DataTypes.ENUM(Object.values(SIGN_IN_METHOD))
    },
    approvelyWithdrawerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    affiliateId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    affiliateCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    newPasswordKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    newPasswordRequested: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    newEmailRequested: {
      type: DataTypes.DATE,
      allowNull: true
    },
    chatSettings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        fontSize: 14,
        displayGIF: true,
        displayLevel: true,
        notificationSound: 'all'
      }
    },
    phoneOtp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authEnable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    authUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isProfile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isUpdateProfile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isJackpotTermsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isJackpotOptedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    jackpotMultiplier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }

  static associate (models) {
    User.hasOne(models.userComment, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.review, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.wallet, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasOne(models.userLimit, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userBonus, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.withdrawal, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.address, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userTournament, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userTag, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userDocument, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.kycActivityLog, { foreignKey: 'userId', onDelete: 'cascade' })
    User.belongsTo(models.country, { foreignKey: 'countryId' })
    User.belongsTo(models.language, { foreignKey: 'languageId' })
    User.belongsTo(models.user, { foreignKey: 'referredBy', as: 'referral' })
    User.hasMany(models.userChatGroup, { foreignKey: 'userId' })
    User.hasMany(models.userNotification, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userVipTier, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.fraudLog, { foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.userPaymentCard, { foreignKey: 'userId', onDelete: 'cascade' })
    super.associate()
  }
}
