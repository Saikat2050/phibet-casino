import { StatusCodes } from 'http-status-codes'

const messages = {
  PLEASE_CHECK_REQUEST_DATA: 'Please check the request data.',
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  RESPONSE_VALIDATION_FAILED: 'Response validation failed.',
  SOCKET_PROVIDE_PROPER_ARGUMENTS: 'Please provide proper arguments for socket.',
  ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED: 'Access token expired or not provided.',
  LIMIT_DOES_NOT_EXISTS: 'Limit does not exist.',
  DOCUMENT_REQUIRES_APPROVAL_BEFORE_PROCEEDING: 'Document requires approval before proceeding.',
  INVALID_WALLET_ID: 'Invalid wallet ID.',
  SERVICE_UNAVAILABLE: 'Service is currently unavailable.',
  TAG_IS_NOT_ATTACHED: 'Tag is not attached.',
  NOT_ENOUGH_AMOUNT: 'Not enough amount.',
  CANNOT_DELETE_DEFAULT_EMAIL_TEMPLATE: 'Cannot delete default email template.',
  BANNER_NOT_FOUND: 'Banner not found.',
  INVALID_IMAGE_NAME: 'Invalid image name.',
  INVALID_IMAGE_URL: 'INVALID_IMAGE_URL',
  PAGE_NOT_FOUND: 'Page not found.',
  DOCUMENT_LABEL_EXISTS: 'Document label already exists.',
  PAGE_SLUG_ALREADY_EXISTS: 'Page slug already exists.',
  CANNOT_DEACTIVATE_DEFAULT_CURRENCY: 'Cannot deactivate default currency.',
  ADMIN_USER_NOT_FOUND: 'Admin user not found.',
  PARENT_ADMIN_NOT_FOUND: 'Parent admin not found.',
  CHILD_ADMIN_USER_NOT_FOUND: 'Child admin user not found.',
  CURRENCY_ALREADY_EXISTS: 'Currency already exists.',
  LANGUAGE_NOT_FOUND: 'Language not found.',
  COMMENT_DOES_NOT_EXISTS: 'Comment does not exist.',
  COUNTRY_NOT_FOUND: 'Country not found.',
  CURRENCY_NOT_FOUND: 'Currency not found.',
  INVALID_PASSWORD: 'Invalid password.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  LOCATION_NOT_FOUND: 'Location not found.',
  EVENT_NOT_FOUND: 'Event not found.',
  TAG_ALREADY_ATTACHED: 'Tag is already attached.',
  TAG_ALREADY_EXIST: 'Tag already exists.',
  AGGREGATOR_NOT_FOUND: 'Aggregator not found.',
  PROVIDER_NOT_FOUND: 'Provider not found.',
  SUB_CATEGORY_NOT_FOUND: 'Sub-category not found.',
  CATEGORY_NOT_FOUND: 'Category not found.',
  USER_DOES_NOT_EXISTS: 'User does not exist.',
  GAME_NOT_FOUND: 'Game not found.',
  INVALID_ID: 'Invalid ID.',
  CATEGORY_ALREADY_EXISTS: 'Category already exists.',
  SUB_CATEGORY_ALREADY_EXISTS: 'Sub-category already exists.',
  BONUS_DOES_NOT_EXISTS: 'Bonus does not exist.',
  INVALID_TOKEN: 'Invalid token.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  EMAIL_NOT_VERIFIED: 'Email is not verified.',
  USERNAME_ALREADY_EXISTS: 'Username already exists.',
  FILE_FORMAT_NOT_SUPPORTED: 'File format is not supported.',
  INVALID_ROLE_ID: 'Invalid role ID.',
  INVALID_TYPE: 'Invalid type.',
  DOCUMENT_ALREADY_APPROVED: 'Document is already approved.',
  DOCUMENTS_NOT_AVAILABLE: 'Documents are not available.',
  DOCUMENT_LABEL_DOES_NOT_EXISTS: 'Document label does not exist.',
  EMAIL_TEMPLATE_NOT_FOUND: 'Email template not found.',
  NO_EXISTING_TEMAPLATE_FOUND_FOR_THIS_EVENT_TYPE: 'No existing template found for this event type.',
  MOVE_ALL_THE_GAMES_TO_ANOTHER_CATEGORY: 'Move all the games to another category before proceeding.',
  NOT_ENOUGH_PERMISSION: 'You do not have enough permission.',
  SUPER_ADMIN_ROLE_ASSIGNMENT_ERROR: 'Super admin role cannot be assigned to other admin users.',
  CHILD_ROLE_CANNOT_BE_SAME_AS_PARENT: 'Child role cannot be the same as parent role.',
  OLD_PASSWORD_AND_NEW_PASSOWRD_MUST_NOT_BE_SAME: 'Old password and new password must not be the same.',
  MAX_ODDS_SHOULD_BE_GREATER_THEN_MIN_ODDS: 'Maximum odds should be greater than minimum odds.',
  DAILY_LIMIT: 'Daily limit cannot exceed the weekly or monthly limit.',
  MONTHLY_LIMIT: 'Monthly limit cannot be lower than the daily or weekly limit.',
  WEEKLY_LIMIT: 'Weekly limit cannot exceed the monthly limit or be lower than the monthly limit.',
  INVALID_CURRENCY_DETAILES: 'Invalid currency details.',
  FREESPIN_QUANTITY_REQUIRED: 'Free spin quantity is required.',
  ACTIVE_BONUS_EXISTS: 'An active bonus already exists.',
  USER_BONUS_ALREADY_EXISTS: 'User bonus already exists.',
  WAGERING_TEMPLATE_DOES_NOT_EXIST: 'Wagering template does not exist.',
  WAGERING_TEMPLATE_ALREADY_EXIST: 'Wagering template already exists.',
  INVALID_DATES: 'Invalid dates.',
  INVALID_PERCENTAGE: 'Invalid Percentage.',
  INVALID_PRIZE: 'Invalid prize.',
  TOURNAMENT_DOES_NOT_EXISTS: 'Tournament does not exist.',
  TOURNAMENT_SETTLED_OR_CANCELLED: 'Tournament is already settled or cancelled.',
  BONUS_UNDER_CLAIM: 'Bonus is currently under claim.',
  AMOUNT_TO_WAGER_EXISTS: 'Amount to wager already exists.',
  TOURNAMENT_EXISTS: 'Tournament already exists.',
  TOURNAMENT_PRIZE_DOES_NOT_EXISTS: 'Tournament prize does not exist.',
  TOURNAMENT_USER_DOES_NOT_EXISTS: 'Tournament user does not exist.',
  PAYMENT_PROVIDER_NOT_FOUND: 'Payment provider not found.',
  NOTIFICATION_SUBSCRIPTION_NOT_EXIST: 'Notification subscription does not exist.',
  NOTIFICATION_NOT_EXIST: 'Notification does not exist.',
  REFERRAL_DOES_NOT_EXISTS: 'Referral does not exist.',
  INVALID_PURPOSE: 'Invalid purpose.',
  PACKAGE_NOT_FOUND: 'Package not found.',
  PACKAGE_ALREADY_EXISTS: 'A package with the same amount, coins, and label already exists.',
  POSTAL_CODE_NOT_AVAILABLE_TRY_LATER: 'Postal code not available. Please try again later.',
  AMO_ENTRY_ALREADY_SETTLED: 'AMOE entry is already settled.',
  VIP_TIER_NAME_EXISTS: 'VIP tier name already exists.',
  VIP_TIER_LEVEL_EXISTS: 'VIP tier level already exists.',
  VIP_TIER_XP_REQUIREMENT: 'XP requirement should be greater than previous tiers.',
  VIP_TIER_DOES_NOT_EXISTS: 'VIP tier does not exist.',
  VIP_TIER_XP_REQUIREMENT_EXISTS: 'XP requirement should be less than higher tiers.',
  WITHDRAWAL_NOT_EXIST: 'Withdrawal does not exist.',
  TRANSACTION_NOT_EXIST: 'Transaction does not exist.',
  INTERNAL_PLAYER_ERROR: 'Internal player error.',
  VIP_TIER_ZERO_LEVEL: 'Cannot set initial level as inactive.',
  VIP_TIER_ZERO_LEVEL_XP: 'Cannot increase XP requirement for level 0.',
  DISCOUNT_AMOUNT_ERROR_TYPE: 'Discount amount should be less than original amount.',
  PHONE_REQUIRED_ERROR: 'Phone number details are missing for the player.',
  KYC_VERIFIED_ERROR: 'KYC is already verified for this player.'
}

export const errorTypes = {
  RequestInputValidationErrorType: {
    name: 'RequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3001
  },
  ResponseValidationErrorType: {
    name: 'ResponseInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.RESPONSE_VALIDATION_FAILED,
    errorCode: 3002
  },
  SocketRequestInputValidationErrorType: {
    name: 'SocketRequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3003
  },
  SocketResponseValidationErrorType: {
    name: 'SocketResponseValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.RESPONSE_VALIDATION_FAILED,
    errorCode: 3004
  },
  InternalServerErrorType: {
    name: 'InternalServerError',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: true,
    description: messages.INTERNAL_SERVER_ERROR,
    errorCode: 3005
  },
  InvalidSocketArgumentErrorType: {
    name: 'InvalidSocketArgumentError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SOCKET_PROVIDE_PROPER_ARGUMENTS,
    errorCode: 3006
  },
  AuthenticationErrorType: {
    name: 'AuthenticationErrorType',
    statusCode: StatusCodes.UNAUTHORIZED,
    isOperational: true,
    description: messages.ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED,
    errorCode: 3007
  },
  NotEnoughPermissionErrorType: {
    name: 'NotEnoughPermissionErrorType',
    statusCode: StatusCodes.UNAUTHORIZED,
    isOperational: true,
    description: messages.NOT_ENOUGH_PERMISSION,
    erroCode: 3062
  },
  LimitDoesNotExistsErrorType: {
    name: 'LimitDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LIMIT_DOES_NOT_EXISTS,
    erroCode: 3008
  },
  DocumentRequiresApprovalBeforeProceedingErrorType: {
    name: 'DocumentRequiresApprovalBeforeProceedingErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_REQUIRES_APPROVAL_BEFORE_PROCEEDING,
    erroCode: 3009
  },
  InvalidWalletIdErrorType: {
    name: 'InvalidWalletIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_WALLET_ID,
    erroCode: 3010
  },
  ServiceUnavailableErrorType: {
    name: 'ServiceUnavailableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SERVICE_UNAVAILABLE,
    erroCode: 3011
  },
  TagIsNotAttachedErrorType: {
    name: 'TagIsNotAttachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TAG_IS_NOT_ATTACHED,
    erroCode: 3012
  },
  NotEnoughAmountErrorType: {
    name: 'NotEnoughAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOT_ENOUGH_AMOUNT,
    erroCode: 3013
  },
  CannotDeleteDefaultEmailTemplateErrorType: {
    name: 'CannotDeleteDefaultEmailTemplateErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CANNOT_DELETE_DEFAULT_EMAIL_TEMPLATE,
    erroCode: 3014
  },
  BannerNotFoundErrorType: {
    name: 'BannerNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BANNER_NOT_FOUND,
    erroCode: 3015
  },
  InvalidImageNameErrorType: {
    name: 'InvalidImageNameErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_IMAGE_NAME,
    erroCode: 3016
  },
  PageNotFoundErrorType: {
    name: 'PageNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PAGE_NOT_FOUND,
    erroCode: 3018
  },
  DocumentLabelExistsErrorType: {
    name: 'DocumentLabelExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_LABEL_EXISTS,
    erroCode: 3019
  },
  PageSlugAlreadyExistsErrorType: {
    name: 'PageSlugAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PAGE_SLUG_ALREADY_EXISTS,
    erroCode: 3020
  },
  CannotDeactivateDefaultCurrencyErrorType: {
    name: 'CannotDeactivateDefaultCurrencyErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CANNOT_DEACTIVATE_DEFAULT_CURRENCY,
    erroCode: 3021
  },
  AdminUserNotFoundErrorType: {
    name: 'AdminUserNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ADMIN_USER_NOT_FOUND,
    erroCode: 3022
  },
  ParentAdminNotFoundErrorType: {
    name: 'ParentAdminNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PARENT_ADMIN_NOT_FOUND,
    erroCode: 3023
  },
  ChildAdminUserNotFoundErrorType: {
    name: 'ChildAdminUserNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CHILD_ADMIN_USER_NOT_FOUND,
    erroCode: 3024
  },
  CurrencyAlreadyExistsErrorType: {
    name: 'CurrencyAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CURRENCY_ALREADY_EXISTS,
    erroCode: 3025
  },
  LanguageNotFoundErrorType: {
    name: 'LanguageNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LANGUAGE_NOT_FOUND,
    erroCode: 3026
  },
  CommentDoesNotExistsErrorType: {
    name: 'CommentDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.COMMENT_DOES_NOT_EXISTS,
    erroCode: 3027
  },
  CountryNotFoundErrorType: {
    name: 'CountryNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.COUNTRY_NOT_FOUND,
    erroCode: 3028
  },
  CurrencyNotFoundErrorType: {
    name: 'CurrencyNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CURRENCY_NOT_FOUND,
    erroCode: 3029
  },
  InvalidPasswordErrorType: {
    name: 'InvalidPasswordErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PASSWORD,
    erroCode: 3030
  },
  PasswordMismatchErrorType: {
    name: 'PasswordMismatchErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PASSWORD_MISMATCH,
    erroCode: 3031
  },
  TagAlreadyAttachedErrorType: {
    name: 'TagAlreadyAttachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TAG_ALREADY_ATTACHED,
    erroCode: 3036
  },
  TagAlreadyExistErrorType: {
    name: 'TagAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TAG_ALREADY_EXIST,
    erroCode: 3037
  },
  AggregatorNotFoundErrorType: {
    name: 'AggregatorNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.AGGREGATOR_NOT_FOUND,
    erroCode: 3038
  },
  ProviderNotFoundErrorType: {
    name: 'ProviderNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PROVIDER_NOT_FOUND,
    erroCode: 3039
  },
  CategoryNotFoundErrorType: {
    name: 'CategoryNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CATEGORY_NOT_FOUND,
    erroCode: 3041
  },
  UserDoesNotExistsErrorType: {
    name: 'UserDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_DOES_NOT_EXISTS,
    erroCode: 3042
  },
  GameNotFoundErrorType: {
    name: 'GameNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.GAME_NOT_FOUND,
    erroCode: 3045
  },
  InvalidIdErrorType: {
    name: 'InvalidIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_ID,
    erroCode: 3046
  },
  CategoryAlreadyExistsErrorType: {
    name: 'CategoryAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CATEGORY_ALREADY_EXISTS,
    erroCode: 3047
  },
  SubCategoryAlreadyExistsErrorType: {
    name: 'SubCategoryAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SUB_CATEGORY_ALREADY_EXISTS,
    erroCode: 3048
  },
  InvalidTokenErrorType: {
    name: 'InvalidTokenErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_TOKEN,
    erroCode: 3049
  },
  EmailAlreadyExistsErrorType: {
    name: 'EmailAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_ALREADY_EXISTS,
    erroCode: 3050
  },
  EmailNotVerifiedErrorType: {
    name: 'EmailNotVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_NOT_VERIFIED,
    erroCode: 3051
  },
  UsernameAlreadyExistsErrorType: {
    name: 'UsernameAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USERNAME_ALREADY_EXISTS,
    erroCode: 3052
  },
  FileFormatNotSupportedErrorType: {
    name: 'FileFormatNotSupportedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.FILE_FORMAT_NOT_SUPPORTED,
    erroCode: 3053
  },
  InvalidRoleIdErrorType: {
    name: 'InvalidRoleIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_ROLE_ID,
    erroCode: 3054
  },
  InvalidTypeErrorType: {
    name: 'InvalidTypeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_TYPE,
    erroCode: 3055
  },
  DocumentAlreadyApprovedErrorType: {
    name: 'DocumentAlreadyApprovedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_ALREADY_APPROVED,
    erroCode: 3056
  },
  DocumentsNotAvailableErrorType: {
    name: 'DocumentsNotAvailableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENTS_NOT_AVAILABLE,
    erroCode: 3057
  },
  DocumentLabelDoesNotExistsErrorType: {
    name: 'DocumentLabelDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_LABEL_DOES_NOT_EXISTS,
    erroCode: 3058
  },
  DocumentDoesNotExistsErrorType: {
    name: 'DocumentDoesNotExistsErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: 'Document does not exist.',
    erroCode: 3072
  },

  DocumentAlreadyRejectedErrorType: {
    name: 'DocumentAlreadyRejectedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Document is already rejected.',
    erroCode: 3073
  },
  KycLevelInvalidErrorType: {
    name: 'KycLevelInvalidErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid KYC level provided.',
    erroCode: 3074
  },
  KycStatusInvalidErrorType: {
    name: 'KycStatusInvalidErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid KYC status provided.',
    erroCode: 3075
  },
  EmailTemplateNotFoundErrorType: {
    name: 'EmailTemplateNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_TEMPLATE_NOT_FOUND,
    erroCode: 3059
  },
  NoExistingTemaplateFoundForThisEventTypeErrorType: {
    name: 'NoExistingTemaplateFoundForThisEventTypeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NO_EXISTING_TEMAPLATE_FOUND_FOR_THIS_EVENT_TYPE,
    erroCode: 3060
  },
  MoveAllTheGamesToAnotherCategoryErrorType: {
    name: 'MoveAllTheGamesToAnotherCategoryErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MOVE_ALL_THE_GAMES_TO_ANOTHER_CATEGORY,
    erroCode: 3061
  },
  SuperAdminRoleAssignmentErrorErrorType: {
    name: 'SuperAdminRoleAssignmentErrorErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SUPER_ADMIN_ROLE_ASSIGNMENT_ERROR,
    erroCode: 3063
  },
  ChildRoleCannotBeSameAsParentErrorType: {
    name: 'ChildRoleCannotBeSameAsParentErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CHILD_ROLE_CANNOT_BE_SAME_AS_PARENT,
    erroCode: 3064
  },
  OldPasswordAndNewPassowrdMustNotBeSameErrorType: {
    name: 'OldPasswordAndNewPassowrdMustNotBeSameErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.OLD_PASSWORD_AND_NEW_PASSOWRD_MUST_NOT_BE_SAME,
    erroCode: 3065
  },
  MaxOddsShouldBeGreaterThenMinOddsErrorType: {
    name: 'MaxOddsShouldBeGreaterThenMinOddsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAX_ODDS_SHOULD_BE_GREATER_THEN_MIN_ODDS,
    erroCode: 3066
  },
  DailyLimitErrorType: {
    name: 'DailyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DAILY_LIMIT,
    erroCode: 3067
  },
  MonthlyLimitErrorType: {
    name: 'MonthlyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MONTHLY_LIMIT,
    erroCode: 3068
  },
  WeeklyLimitErrorType: {
    name: 'WeeklyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WEEKLY_LIMIT,
    erroCode: 3069
  },
  BonusDoesNotExistsErrorType: {
    name: 'BonusDoesNotExistsErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: messages.BONUS_DOES_NOT_EXISTS,
    erroCode: 3070
  },
  InvalidCurrencyDetailsErrorType: {
    name: 'InvalidCurrencyDetailsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_CURRENCY_DETAILES,
    errorCode: 3071
  },
  FreeSpinQuantityRequiredErrorType: {
    name: 'FreeSpinQuantityRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.FREESPIN_QUANTITY_REQUIRED,
    errorCode: 3072
  },
  ActiveBonusExistsErrorType: {
    name: 'ActiveBonusExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ACTIVE_BONUS_EXISTS,
    errorCode: 3073
  },
  WageringTemplateDoesNotExistsErrorType: {
    name: 'WageringTemplateDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WAGERING_TEMPLATE_DOES_NOT_EXIST,
    errorCode: 3074
  },
  WageringTemplateExistsErrorType: {
    name: 'WageringTemplateExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WAGERING_TEMPLATE_ALREADY_EXIST,
    errorCode: 3075
  },
  InvalidDateErrorType: {
    name: 'InvalidDateErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_DATES,
    errorCode: 3076
  },
  InvalidPrizeErrorType: {
    name: 'InvalidPrizeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PRIZE,
    errorCode: 3077
  },
  TournamentDoesNotExistErrorType: {
    name: 'TournamentDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_DOES_NOT_EXISTS,
    errorCode: 3078
  },
  UserBonusAlreadyExistErrorType: {
    name: 'UserBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_BONUS_ALREADY_EXISTS,
    errorCode: 3079
  },
  TournamentSettledOrCancelledErrorType: {
    name: 'TournamentSettledOrCancelledErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_SETTLED_OR_CANCELLED,
    errorCode: 3079
  },
  BonusUnderClaimExistsErrorType: {
    name: 'BonusUnderClaimExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_UNDER_CLAIM,
    errorCode: 3080
  },
  AmountToWagerExistsErrorType: {
    name: 'AmountToWagerExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_UNDER_CLAIM,
    errorCode: 3081
  },
  TournamentExistsErrorType: {
    name: 'TournamentExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_EXISTS,
    errorCode: 3082
  },
  TournamentPrizeNotExistErrorType: {
    name: 'TournamentPrizeNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_PRIZE_DOES_NOT_EXISTS,
    errorCode: 3083
  },
  TournamentUserNotExistErrorType: {
    name: 'TournamentUserNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_USER_DOES_NOT_EXISTS,
    errorCode: 3083
  },
  PaymentProviderNotExistErrorType: {
    name: 'PaymentProviderNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_USER_DOES_NOT_EXISTS,
    errorCode: 3084
  },
  NotificationSubscriptionNotExistErrorType: {
    name: 'NotificationSubscriptionNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOTIFICATION_SUBSCRIPTION_NOT_EXIST,
    errorCode: 3085
  },
  NotificationNotExistErrorType: {
    name: 'NotificationNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOTIFICATION_NOT_EXIST,
    errorCode: 3086
  },
  ReferralNotExistErrorType: {
    name: 'ReferralNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.REFERRAL_DOES_NOT_EXISTS,
    errorCode: 3085
  },
  InvalidPurposeErrorType: {
    name: 'InvalidPurposeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PURPOSE,
    errorCode: 3084
  },
  ThisGroupNameAlreadyExistsErrorType: {
    name: 'ThisGroupNameAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group name already exist',
    errorCode: 3085
  },
  ThisCriteriaDoesNotExistsErrorType: {
    name: 'ThisCriteriaDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid Criteria',
    errorCode: 3086
  },
  GlobalGroupExistErrorType: {
    name: 'GlobalGroupExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Global group already exist',
    errorCode: 3087
  },
  InvalidChatGroupErrorType: {
    name: 'InvalidChatGroupErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group not exist',
    errorCode: 3088
  },
  ChatRainAlreadyActiveErrorType: {
    name: 'ChatRainAlreadyActiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat Rain Already Exist',
    errorCode: 3089
  },
  ThisChatRuleDoesNotExistErrorType: {
    name: 'ThisChatRuleDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'ChatRule not exist',
    errorCode: 3090
  },
  OffensiveWordAlreadyExistErrorType: {
    name: 'OffensiveWordAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This word already exist',
    errorCode: 3091
  },
  OffensiveWordNotFoundErrorType: {
    name: 'OffensiveWordNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This word not exist',
    errorCode: 3092
  },
  ThisGroupDoesNotExistsErrorType: {
    name: 'ThisGroupDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group not exist',
    errorCode: 3093
  },
  CredentialsAlreadyExistsErrorType: {
    name: 'CredentialsAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Credentials already exist',
    errorCode: 3094
  },
  EmailAlreadyVerifiedErrorType: {
    name: 'EmailAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'EMAIL_ALREADY_VERIFIED',
    errorCode: 3095
  },
  JoiningBonusAlreadyExistErrorType: {
    name: 'JoiningBonusAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'JOINING_BONUS_ALREADY_EXIST',
    errorCode: 3096
  },
  PackageAlreadyExistsErrorType: {
    name: 'PackageAlreadyExistsErrorType',
    statusCode: StatusCodes.CONFLICT,
    isOperational: true,
    description: messages.PACKAGE_ALREADY_EXISTS,
    errorCode: 3097
  },
  PackageNotFoundErrorType: {
    name: 'PackageNotFoundErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: messages.PACKAGE_NOT_FOUND,
    errorCode: 3098
  },
  PostalCodeInactiveErrorType: {
    name: 'PostalCodeInactiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.POSTAL_CODE_NOT_AVAILABLE_TRY_LATER,
    errorCode: 3099
  },
  AmoEntryAlreadySettleErrorType: {
    name: 'AmoEntryAlreadySettleErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.AMO_ENTRY_ALREADY_SETTLED,
    errorCode: 3100
  },
  WithdrawalNotExistErrorType: {
    name: 'WithdrawalNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WITHDRAWAL_NOT_EXIST,
    errorCode: 3101
  },
  TransactionNotExistErrorType: {
    name: 'TransactionNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TRANSACTION_NOT_EXIST,
    errorCode: 3102
  },
  VipTierNameExistsErrorType: {
    name: 'VipTierNameExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_NAME_EXISTS,
    errorCode: 3103
  },
  VipTierLevelExistsErrorType: {
    name: 'VipTierLevelExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_LEVEL_EXISTS,
    errorCode: 3104
  },
  VipTierXpRequirementErrorType: {
    name: 'VipTierXpRequirementErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_XP_REQUIREMENT,
    errorCode: 3105
  },
  VipTierDoesNotExistsErrorType: {
    name: 'VipTierDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_DOES_NOT_EXISTS,
    errorCode: 3106
  },
  VipTierXpRequirementExistsErrorType: {
    name: 'VipTierXpRequirementExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_XP_REQUIREMENT_EXISTS,
    errorCode: 3107
  },
  InternalPlayerErrorType: {
    name: 'InternalPlayerErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INTERNAL_PLAYER_ERROR,
    erroCode: 3108
  },
  VipTierZeroLevelErrorType: {
    name: 'VipTierZeroLevelErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_ZERO_LEVEL,
    errorCode: 3109
  },
  DiscountAmountErrorType: {
    name: 'DiscountAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DISCOUNT_AMOUNT_ERROR_TYPE,
    errorCode: 3110
  },
  VipTierZeroLevelXpErrorType: {
    name: 'VipTierZeroLevelXpErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.VIP_TIER_ZERO_LEVEL_XP,
    errorCode: 3111
  },
  PhoneRequiredErrorType: {
    name: 'PhoneRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PHONE_REQUIRED_ERROR,
    errorCode: 3112
  },
  KycAlreadyVerifiedErrorType: {
    name: 'KycAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.KYC_VERIFIED_ERROR,
    errorCode: 3113
  },
  ExceedChatLengthErrorType: {
    name: 'ExceedChatLengthErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Message length exceeded',
    errorCode: 3114
  },
  MinimumChatRainPerUserErrorType: {
    name: 'MinimumChatRainPerUserErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Less than minimum chat rain per user',
    errorCode: 3115
  },
  AlreadyGrabbedChatRainErrorType: {
    name: 'AlreadyGrabbedChatRainErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Already grabbed by one of the user',
    errorCode: 3116
  },
  ChatRainDoesNotExistErrorType: {
    name: 'ChatRainDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat Rain Does Not Exist',
    errorCode: 3117
  },
  SegmentNameAlreadyExistsErrorType: {
    name: 'SegmentNameAlreadyExists',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Segment name already exists',
    errorCode: 3118
  },
  SegmentDoesNotExistErrorType: {
    name: 'SegmentDoesNotExist',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Segment does not exists',
    errorCode: 3119
  },
  EmailTemplateExistWithSameLabelErrorType: {
    name: 'EmailTemplateExistWithSameLabelErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Email Template Exist With Same Label',
    errorCode: 3120
  },
  TestimonialNotFoundErrorType: {
    name: 'TestimonialNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TESTIMONIAL_NOT_FOUND,
    erroCode: 3121
  },
  TestimonialAuthorAlreadyExistErrorType: {
    name: 'TestimonialAuthorAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Testimonial Author Already Exist',
    erroCode: 3122
  },
  InvalidTimePeriodErrorType: {
    name: 'InvalidTimePeriodErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'The provided timePeriod is invalid. Allowed values: daily, weekly, monthly.',
    errorCode: 3123
  },
  UserDetailsNotMachingWithIdErrorType: {
    name: 'UserDetailsNotMachingWithIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'IDComply verification failed. Please ensure the details entered exactly match those on user ID.',
    errorCode: 3124
  },
  UserFoundMortalityOrHardstoppedErrorType: {
    name: 'UserDetailsNotMachingWithIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'IDComply verification found user ID in mortality or hard stopped.',
    errorCode: 3124
  },
  ImageUrlNotFoundErrorType: {
    name: 'ImageUrlNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_IMAGE_URL,
    erroCode: 3125
  },
  InvalidJackpotShareErrorType: {
    name: 'InvalidJackpotShareErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Admin and Pool Share doesn\'t add up to 100%',
    errorCode: 3125
  },
  JackpotBreakEvenErrorType: {
    name: 'JackpotBreakEvenErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Admin share from ticket sales is insufficient to cover the seed amount. Please adjust the admin share, entry amount, or max ticket size to ensure no loss.',
    errorCode: 3126
  },
  JackpotNotUpcomingErrorType: {
    name: 'JackpotNotUpcomingErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Jackpot is not a upcoming jackpot.',
    errorCode: 3127
  },
  JackpotNotExistErrorType: {
    name: 'JackpotNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Jackpot does not exists.',
    errorCode: 3128
  },
  DocumentLabelAlreadyExistsErrorType: {
    name: 'DocumentLabelAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Document Label already exist.',
    erroCode: 3129
  },
  ChatSettingsNotFoundErrorType: {
    name: 'ChatSettingsNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat Settings not found.',
    errorCode: 3130
  },
  InvalidChatSettingsErrorType: {
    name: 'InvalidChatSettingsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid Chat Settings.',
    errorCode: 3131
  },
  AtLeastOneUserOrSegmentRequiredErrorType: {
    name: 'AtLeastOneUserOrSegmentRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'At least one user or segment is required.',
    errorCode: 3132
  },
  InvalidUsersErrorType: {
    name: 'InvalidUsersErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid users provided.',
    errorCode: 3133
  },
  InvalidSegmentsErrorType: {
    name: 'InvalidSegmentsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid segments provided.',
    errorCode: 3134
  },
  ChatGroupNotFoundErrorType: {
    name: 'ChatGroupNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat group not found.',
    errorCode: 3135
  },
  GlobalGroupCannotBeDeletedErrorType: {
    name: 'GlobalGroupCannotBeDeletedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Global chat group cannot be deleted.',
    errorCode: 3136
  },
  ChatDetailIdOrGroupIdRequired: {
    name: 'ChatDetailIdOrGroupIdRequired',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat detail ID or group ID is required.',
    errorCode: 3136
  },
  PromoCodeAlreadyExistErrorType: {
    name: 'PromoCodeAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PROMO_CODE_ALREADY_EXIST_ERROR,
    errorCode: 3126
  },
    PromocodeNotExistErrorType: {
    name: 'PromocodeNotExistErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: 'Promocode does not exist',
    errorCode: 3127
  },
  DuplicatePromoCodeNameErrorType: {
    name: 'DuplicatePromoCodeNameErrorType',
    statusCode: StatusCodes.CONFLICT,
    isOperational: true,
    description: 'A promocode with the same name already exists',
    errorCode: 3128
  },
    InvalidPercentageValueErrorType: {
    name: 'InvalidPercentageValueErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_PERCENTAGE,
    errorCode: 3129
  },
}
