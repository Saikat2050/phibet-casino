import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { PROVIDER_TYPE } from '@src/utils/constants/public.constants.utils'

export default class ProviderCredentials extends ModelBase {
  static model = 'providerCredentials'

  static table = 'provider_credentials'

  static options = {
    name: {
      singular: 'provider_credential',
      plural: 'provider_credentials'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    credentials: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    providerType: {
      type: DataTypes.ENUM(Object.values(PROVIDER_TYPE)),
      allowNull: false,
      defaultValue: PROVIDER_TYPE.OTHER
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
