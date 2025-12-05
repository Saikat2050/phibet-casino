'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    const documentLabels = [
      {
        name: 'Passport',
        description: 'Valid passport document',
        is_required: true,
        is_active: true,
        kyc_level: 3,
       
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'National ID Card',
        description: 'Government issued national identity card',
        is_required: true,
        is_active: true,
        kyc_level: 3,
        
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Drivers License',
        description: 'Valid drivers license',
        is_required: false,
        is_active: true,
        kyc_level: 3,
       
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Utility Bill',
        description: 'Recent utility bill for address verification',
        is_required: true,
        is_active: true,
        kyc_level: 3,
       
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bank Statement',
        description: 'Recent bank statement for financial verification',
        is_required: false,
        is_active: true,
        kyc_level: 3,
       
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Selfie with ID',
        description: 'Selfie holding the submitted ID document',
        is_required: true,
        is_active: true,
        kyc_level: 3,
       
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    await queryInterface.bulkInsert('document_labels', documentLabels, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('document_labels', null, {})
  }
} 