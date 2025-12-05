import { KYC_LEVELS } from "@src/utils/constants/public.constants.utils"
import { DataTypes } from 'sequelize'

export default {
  type: 'object',
  properties: {
    // kycLevel: {
    //   type: 'string',
    //   enum: [...new Set(Object.values(KYC_LEVELS))],
    //   description: 'Filter labels by KYC level'
    // },
    isRequired: {
      type: 'boolean',
      description: 'Filter labels by required status'
    }
  },
  additionalProperties: false
}
