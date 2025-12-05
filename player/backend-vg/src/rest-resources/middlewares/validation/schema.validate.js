import { PAYMENT_METHOD } from '../../../utils/constants/constant'

export const signUpSchemas = {
  bodySchema: {
    $ref: '/signUp.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' },
        success: { type: 'boolean' }
      },
      required: ['message', 'user', 'success']
    }
  }
}

export const loginSchemas = {
  bodySchema: {
    $ref: '/login.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' }
      },
      required: ['message', 'user']
    }
  }
}

export const googleLoginSchemas = {
  bodySchema: {
    $ref: '/google-login.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' }
      },
      required: ['message', 'user', 'success']
    }
  }
}

export const facebookLoginSchemas = {
  bodySchema: {
    $ref: '/facebook-login.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' }
      },
      required: ['message', 'user', 'success']
    }
  }
}

export const appleLoginSchemas = {
  bodySchema: {
    $ref: '/apple-login.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' }
      },
      required: ['message', 'user', 'success']
    }
  }
}

export const verifyEmailSchemas = {
  bodySchema: {
    $ref: '/verifyEmail.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const UpdateEmailSchemas = {
  bodySchema: {
    $ref: '/updateEmail.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const verifyPhoneSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      phone: {
        type: 'string'
      },
      code: {
        type: 'number'
      },
      otp: {
        type: 'string'
      }
    },
    required: ['phone', 'code', 'otp']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success', 'user']
    }
  }
}

export const updateProfileSchemas = {
  bodySchema: {
    $ref: '/updateProfile.json'
  }
}

export const updateProfileUsernameSchemas = {
  bodySchema: {
    $ref: '/updateProfileUsername.json'
  }
}

export const changePasswordSchemas = {
  bodySchema: {
    $ref: '/changePassword.json'
  }
}

export const forgetPasswordSchema = {
  bodySchema: {
    $ref: '/forgetPassword.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const verifyForgetPasswordSchema = {
  bodySchema: {
    $ref: '/verifyForgetPassword.json'
  }
}

export const otpSentForgetPasswordSchema = {
  bodySchema: {
    $ref: '/otpSentForgetPasswordSchema.json'
  }
}

export const phoneSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      phone: {
        type: 'string'
        // pattern: '^[ ()+]*([0-9][ ()+]*){10}$'
      },
      code: {
        type: 'string'
      },
      otp: {
        type: 'string'
      },
      sessionKey: {
        type: ['string']
      }
    },
    required: ['phone', 'code', 'otp']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const getPackagesSchemas = {
  bodySchema: {},
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            firstPurchaseBonus: { type: 'object' },
            packageData: {
              type: 'object',
              properties: {
                count: { type: 'number' },
                rows: { type: 'array' }
              }
            }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'data', 'success']
    }
  }
}

export const cmsSchemas = {
  bodySchema: {},
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'array' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const cmsDetailSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      cmsId: {
        type: 'string'
      },
      footer: {
        type: 'string',
        enum: ['0', '1']
      },
      pageSlug: {
        type: 'string'
      }
    },
    required: []
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const defaultResponseSchemas = {
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const getGamesSchemas = {
  bodySchema: {},
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'data', 'success']
    }
  }
}

export const launchGameSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      gameId: {
        type: 'number'
      },
      coin: {
        type: 'string',
        enum: ['SC', 'GC']
      },
      isMobile: {
        type: 'boolean'
      },
      isDemo: {
        type: 'boolean'
      },
      tournamentId: {
        type: ['number', 'null']
      }
    },
    required: ['gameId', 'coin']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' },
        isFavorite: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const favoriteSchema = {
  bodySchema: {
    $ref: '/favorite.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const getFavourateGamesSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'string',
        pattern: '^[0-9]+$'
      },
      page: {
        type: 'string',
        pattern: '^[0-9]+$'
      }
    }
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'data', 'success']
    }
  }
}

export const responsibleGamblingSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      dailyDepositLimit: {
        type: 'string'
      },
      weeklyDepositLimit: {
        type: 'string'
      },
      monthlyDepositLimit: {
        type: 'string'
      },
      dailyBetLimit: {
        type: 'string'
      },
      weeklyBetLimit: {
        type: 'string'
      },
      monthlyBetLimit: {
        type: 'string'
      },
      selfExclusion: {
        type: 'string'
      },
      timeBreak: {
        type: 'string'
      },
      selfExclusionTimeDuration: {
        enum: ['24Hours', '7Days', '72Hours', '30Days', '6Months', '1Year', 'indefinitely']
      },
      password: {
        type: 'string'
      }
    }
  }
}

export const getBetsSchemas = {
  querySchema: {
    $ref: '/getBets.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'data', 'success']
    }
  }
}

export const initPaySchema = {
  bodySchema: {
    $ref: '/initPay.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        paymentData: { type: ['object', 'null'] },
        limitCheck: { type: ['object', 'null'] },
        success: { type: 'boolean' }
      },
      required: ['success']
    }
  }
}

export const proceedPaymentPaysafeSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      packageId: {
        type: 'number'
      },
      paymentMethod: {
        type: 'string',
        enum: Object.values(PAYMENT_METHOD)
      },
      merchantRefNum: {
        type: 'string'
      },
      paymentHandleToken: {
        type: 'string'
      }
    },
    required: [
      'packageId',
      'paymentMethod',
      'merchantRefNum',
      'paymentHandleToken'
    ]
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        details: { type: 'object' }
      },
      required: ['details', 'success']
    }
  }
}

export const cancelRedeemRequestSchema = {
  bodySchema: {
    $ref: '/cancel-redeem-request.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        request: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const getRedeemRequests = {
  querySchema: {
    $ref: '/getRedeemRequests.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'data', 'success']
    }
  }
}

export const isUserNameExist = {
  querySchema: {
    $ref: '/userNameExist.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        user: {
          // isUserNameExist: { type: 'boolean' }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'user', 'success']
    }
  }
}

export const gamblingHistorySchema = {
  querySchema: {
    type: 'object',
    properties: {
      limitType: {
        type: 'string'
      },
      startDate: {
        type: 'string'
      }
    },
    required: ['limitType']
  }
}

export const getGamblingSchema = {
  querySchema: {
    type: 'object',
    properties: {
      responsibleGamblingType: {
        type: 'string'
      }
    },
    required: ['responsibleGamblingType']
  }
}

export const claimDailyBonusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      sessionKey: {
        type: ['string']
      },
      needDailyBonus: { type: 'string' }
    },
    required: []
  }
}

export const getBankDetails = {
  querySchema: {
    $ref: '/getBankDetails.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        bankDetails: { type: ['object', 'null'] }
      },
      required: ['message', 'success']
    }
  }
}

export const editBankDetailsSchema = {
  bodySchema: {
    $ref: '/editBankDetails.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        bankDetails: { type: 'object' }
      },
      required: ['message', 'bankDetails']
    }
  }
}

export const removeResponsibleGamblingSetting = {
  bodySchema: {
    type: 'object',
    properties: {
      responsibleGamblingId: {
        type: ['string']
      }
    },
    required: ['responsibleGamblingId']
  }
}

export const getPaymentStatus = {
  querySchema: {
    $ref: '/getPaymentStatus.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        status: { type: 'string' },
        paymentResponse: { type: ['object', 'null'] }
      },
      required: ['success']
    }
  }
}

export const applyAffiliateSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      permission: { type: 'object' },
      isActive: { type: 'boolean' },
      phoneCode: { type: 'string' },
      phone: { type: 'string' },
      state: { type: 'string' },
      preferredContact: { type: 'string' },
      trafficSource: { type: 'string' },
      plan: { type: 'string' },
      isTermsAccepted: { type: 'boolean' }
    },
    required: ['firstName', 'lastName', 'email', 'phoneCode', 'phone', 'state', 'preferredContact', 'trafficSource', 'plan', 'isTermsAccepted']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        applyAffiliate: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const joinTournamentSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      tournamentId: {
        type: ['number']
      }
    },
    required: ['tournamentId']
  }
}

export const updateRedeemRequestSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      transactionId: { type: 'number' },
      actionableEmail: { type: 'string' }
    },
    required: ['transactionId', 'actionableEmail']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      }
    }
  }
}

export const termAndConditionSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      isTermsAccepted: { type: 'boolean' }
    },
    required: ['isTermsAccepted']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      }
    }
  }
}

export const userRaffleTicketSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'string',
        pattern: '^[0-9]+$'
      },
      page: {
        type: 'string',
        pattern: '^[0-9]+$'
      },
      startDate: {
        type: 'string'
      },
      endDate: {
        type: 'string'
      },
      orderBy: { type: ['string', 'null'] },
      sort: { type: ['string', 'null'] }
    },
    required: ['page', 'limit', 'startDate']
  }
}

export const vaultDepositRequestSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      coinType: { type: 'string' },
      amount: { type: 'number' },
      token: { type: ['string', 'null'] },
      password: { type: ['string', 'null'] }
    },
    required: ['coinType', 'amount']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      }
    }
  }
}

export const vaultWithdrawRequestSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      coinType: { type: 'string' },
      amount: { type: 'number' },
      token: { type: ['string', 'null'] },
      password: { type: ['string', 'null'] }
    },
    required: ['coinType', 'amount']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      }
    }
  }
}

export const userFeedbackSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      title: { enum: ['Feedback', 'Bug-Report'] },
      body: { type: 'string' }
    },
    required: ['title', 'body']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      }
    }
  }
}

export const payByBankRequestSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      amount: { type: 'number' }
    }
  }
}
