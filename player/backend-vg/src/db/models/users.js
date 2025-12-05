'use strict'
import {
  ROLE,
  SIGN_IN_METHOD,
  STATUS_VALUE
} from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      userId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      uniqueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // locale: {
      //   type: DataTypes.STRING,
      //   allowNull: true
      // },
      signInCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      signInIp: {
        type: DataTypes.INET,
        allowNull: true
      },
      signInMethod: {
        type: DataTypes.ENUM(Object.values(SIGN_IN_METHOD)),
        allowNull: false,
        comment: 'normal:0, google:1, facebook:2'
      },
      // parentType: {
      //   type: DataTypes.STRING, // Not needed
      //   allowNull: true
      // },
      // parentId: {
      //   type: DataTypes.INTEGER, // Not needed
      //   allowNull: true
      // },
      countryCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      // selfExclusion: {
      //   type: DataTypes.DATE, // Reason
      //   allowNull: true
      // },
      // selfExclusionUpdatedAt: {
      //   type: DataTypes.DATE,
      //   allowNull: true
      // },
      // disabledAt: {
      //   type: DataTypes.DATE,
      //   allowNull: true
      // },
      // disabledByType: {
      //   type: DataTypes.STRING,
      //   allowNull: true
      // },
      // disabledById: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // disableReason: {
      //   type: DataTypes.STRING,
      //   allowNull: true
      // },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      newOtpRequested: {
        type: DataTypes.DATE,
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
      city: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      zipCode: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      affiliateId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      affiliateCode: {
        type: DataTypes.UUID,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      kycStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: STATUS_VALUE.PENDING
      },
      sumsubKycStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'sumsub_kyc_status'
      },
      kycApplicantId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // level: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   defaultValue: 1
      // },
      // loyaltyPoints: {
      //   type: DataTypes.FLOAT,
      //   allowNull: true,
      //   defaultValue: 0
      // },
      loggedIn: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      deviceType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // tags: {
      //   type: DataTypes.JSONB,
      //   allowNull: true
      // },
      // affiliateStatus: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: true,
      //   defaultValue: false
      // },
      // trackingToken: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   defaultValue: null
      // },
      // isAffiliateUpdated: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: true,
      //   defaultValue: null
      // },
      state: {
        type: DataTypes.STRING
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      fbUserId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otpVerifiedDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isBan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isRestrict: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      passwordAttempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isInternalUser: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          isRedemptionSubscribed: true,
          isSubscribed: true,
          verified: false
        }
      },
      paysafeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'paysafe_customer_id'
      },
      referredBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'referred_by'
      },
      referralCode: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'referral_code'
      },
      authSecret: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authEnable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      emailMarketing: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      smsMarketing: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      pushcashUserId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'pushcash_user_id'
      },
      profileCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isKycRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isAllPromocodeDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  User.associate = function (model) {
    User.hasMany(model.ResponsibleGambling, {
      as: 'responsibleGambling',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.Limit, {
      as: 'userLimit',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.UserDocument, {
      as: 'userDocuments',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.WithdrawRequest, {
      as: 'withdrawRequests',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasOne(model.Wallet, {
      foreignKey: 'ownerId',
      as: 'userWallet',
      constraints: false,
      scope: {
        ownerType: ROLE.USER
      },
      onDelete: 'cascade'
    })
    User.hasMany(model.TransactionBanking, {
      foreignKey: 'actioneeId',
      as: 'transactionBanking',
      constraints: false,
      scope: {
        actioneeType: ROLE.USER
      }
    })
    User.hasMany(model.FavoriteGame, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.UserBonus, {
      as: 'userBonus',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.CasinoTransaction, {
      as: 'casinoTransactions',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PostalCode, {
      as: 'userPostalCode',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PersonalBonus, {
      as: 'personalBonus',
      foreignKey: 'createdBy',
      sourceKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PersonalBonus, {
      foreignKey: 'claimedBy',
      sourceKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasOne(model.UserTier, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.RafflesEntry, {
      as: 'RafflesEntry',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasOne(model.PromoCodeUser, {
      as: 'promoCodeUser',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
  }
  return User
}
