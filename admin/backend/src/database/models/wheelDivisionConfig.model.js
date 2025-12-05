import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'

export default class WheelDivisionConfiguration extends ModelBase {
    static model = 'wheelDivisionConfiguration'

    static table = 'wheel_division_configurations'

    static options = {
      name: {
        singular: 'wheel_division_configuration',
        plural: 'wheel_division_configurations'
      }
    }

    static attributes = {
      wheelDivisionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      sc: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      gc: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      isAllow: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      playerLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }
}
