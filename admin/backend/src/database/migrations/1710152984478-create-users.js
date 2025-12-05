module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'users',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'username',
          _modelAttribute: true,
          field: 'username'
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'firstName',
          _modelAttribute: true,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'lastName',
          _modelAttribute: true,
          field: 'last_name'
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'email',
          _modelAttribute: true,
          field: 'email'
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'emailVerified',
          _modelAttribute: true,
          field: 'email_verified'
        },
        phoneCode: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'phoneCode',
          _modelAttribute: true,
          field: 'phone_code'
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'phone',
          _modelAttribute: true,
          field: 'phone'
        },
        phoneVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          fieldName: 'phoneVerified',
          _modelAttribute: true,
          field: 'phone_verified'
        },
        languageId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'languageId',
          _modelAttribute: true,
          field: 'language_id',
          references: {
            model: {
              tableName: 'languages',
              table: 'languages',
              name: 'language',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'dateOfBirth',
          _modelAttribute: true,
          field: 'date_of_birth'
        },
        gender: {
          type: DataTypes.ENUM,
          allowNull: true,
          values: ['male', 'female', 'unknown'],
          fieldName: 'gender',
          _modelAttribute: true,
          field: 'gender'
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'password',
          _modelAttribute: true,
          field: 'password'
        },
        loggedIn: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'loggedIn',
          _modelAttribute: true,
          field: 'logged_in'
        },
        lastLoggedInIp: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'lastLoggedInIp',
          _modelAttribute: true,
          field: 'last_logged_in_ip'
        },
        loggedInAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'loggedInAt',
          _modelAttribute: true,
          field: 'logged_in_at'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'imageUrl',
          _modelAttribute: true,
          field: 'image_url'
        },
        kycStatus: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'kycStatus',
          _modelAttribute: true,
          field: 'kyc_status'
        },
        loyaltyPoints: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'loyaltyPoints',
          _modelAttribute: true,
          field: 'loyalty_points'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        countryId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'countryId',
          _modelAttribute: true,
          field: 'country_id',
          references: {
            model: {
              tableName: 'countries',
              table: 'countries',
              name: 'country',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        sessionLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'sessionLimit',
          _modelAttribute: true,
          field: 'session_limit'
        },
        publicAddress: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'publicAddress',
          _modelAttribute: true,
          field: 'public_address'
        },
        nonce: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'nonce',
          _modelAttribute: true,
          field: 'nonce'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'updatedAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      },
      {
        schema: 'public'
      }
    )
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('users', { schema: 'public' })
  }
}
