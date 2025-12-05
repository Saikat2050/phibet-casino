export const getApplicationSettingsSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            maxOdds: { type: 'object' },
            minOdds: { type: 'object' },
            allowBetting: { type: 'object' },
            maintenance: { type: 'object' },
            minStakeAmount: { type: 'object' },
            exchangeBetCommission: { type: 'object' },
            casino: { type: 'object' },
            defaultSupport: { type: 'object' },
            adminEndUrl: { type: 'object' },
            userEndUrl: { type: 'object' },
            gallery: { type: 'object' },
            referral: { type: 'object' },
            XpRequirementsConversion: { type: 'object' },
            amoEntryAddress: { type: 'object' },
            legalSupport: { type: 'object' },
            partnersSupport: { type: 'object' },
            depositKycRequired: { type: 'object' },
            withdrawKycRequired: { type: 'object' },
            depositPhoneRequired: { type: 'object' },
            withdrawPhoneRequired: { type: 'object' },
            depositProfileRequired: { type: 'object' },
            withdrawProfileRequired: { type: 'object' },
            xpRequirements: { type: 'object' },
            gamePlayeKycRequired: { type: 'object' },
            logo: { type: 'object' },
            footerLandingPage: { type: 'object' },
            footerLobbyPage: { type: 'object' },
            purchaseCooldown: { type: 'object'}
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
