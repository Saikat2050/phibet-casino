import { AMOE_STATUS } from '@src/utils/constants/public.constants.utils'
import ModelBase from './modelBase.model'
import { DataTypes } from 'sequelize'

export default class AmoEntry extends ModelBase {
    static model = 'amoEntry'

    static table = 'amoentries'

    static options = {
        name: {
            singular: 'amoentry',
            plural: 'amoentries'
        }
    }

    static attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        entryDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Option to mark invalid entries if needed
        },
        status: {
            type: DataTypes.ENUM(Object.values(AMOE_STATUS)),
            defaultValue: AMOE_STATUS.PENDING,  // New status field
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

    static associate(models) {
        AmoEntry.belongsTo(models.user, { foreignKey: 'userId' })
        super.associate()
    }
}
