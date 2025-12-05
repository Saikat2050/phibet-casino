import { StatusCodes } from 'http-status-codes'

export const messages = {
  PLEASE_CHECK_REQUEST_DATA: 'Please check request data.',
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again or contact support.',
  RESPONSE_VALIDATION_FAILED: 'Response validation failed.',
  SOCKET_PROVIDE_PROPER_ARGUMENTS: 'Please provide proper arguments for socket.',
  ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED: 'Access token expired or not provided.',
  USER_DOES_NOT_EXISTS: 'User does not exist.',
  BONUS_ACTIVATE: 'Bonus activated.',
  CANCEL_SUCCESS: 'Cancelled successfully.',
  USER_INACTIVE: 'User is inactive.',
  WRONG_PASSWORD: 'Wrong password.',
  EMAIL_NOT_VERIFIED: 'Email not verified.',
  USERNAME_OR_EMAIL_ALREADY_EXISTS: 'Username or email already exists.',
  USER_NOT_LOGGED_IN: 'User not logged in.',
  SESSION_EXPIRED: 'Session expired.',
  USERNAME_IS_TAKEN: 'Username is already taken.',
  PHONE_IS_TAKEN: 'Phone number is already in use.',
  LIMIT_NOT_FOUND: 'Limit not found.',
  INVALID_TIME_UNIT: 'Invalid time unit.',
  INVALID_VALUE: 'Invalid value.',
  EXCLUDED_PERMANENTLY_PLEASE_CONTACT_PROVIDER: 'Permanently excluded. Please contact provider.',
  INVALID_EVENT_ID_COMBINATION: 'Invalid event ID combination.',
  INVALID_WALLET_ID: 'Invalid wallet ID.',
  NOT_ENOUGH_AMOUNT: 'Not enough amount.',
  ACCESS_TOKEN_NOT_FOUND: 'Access token not found.',
  BETTING_IS_DIABLED: 'Betting is disabled.',
  MIN_STAKE_REQUIRED: 'Minimum stake required.',
  ODDS_SHULD_BE_IN_RANGE: 'Odds should be in valid range.',
  INVALID_BONUS_ID: 'Invalid bonus ID.',
  EXCLUDED_TEMPORARILY: 'Temporarily excluded.',
  INVALID_ADDRESS_ID: 'Invalid address ID.',
  INVALID_TOKEN: 'Invalid token.',
  WRONG_TOKEN_TYPE: 'Wrong token type.',
  FILE_DOES_NOT_EXISTS: 'File does not exist.',
  INVALID_DOCUMENT_LABEL_ID: 'Invalid document label ID.',
  DOCUMENT_IS_APPROVED: 'Document is already approved.',
  INVALID_DOCUMENT_ID: 'Invalid document ID.',
  INVALID_BONUS: 'Invalid bonus.',
  BONUS_ALREADY_ACTIVE: 'Bonus is already active.',
  CASHOUT_NOT_ALLOWED: 'Cashout not allowed.',
  FILE_FORMAT_NOT_SUPPORTED: 'File format not supported.',
  DAILY_BET_LIMIT_EXCEEDED: 'Daily bet limit exceeded.',
  WEEKLY_BET_LIMIT_EXCEEDED: 'Weekly bet limit exceeded.',
  MONTHLY_BET_LIMIT_EXCEEDED: 'Monthly bet limit exceeded.',
  SERVICE_UNAVAILABLE: 'Service unavailable.',
  CURRENCY_NOT_AVAILABLE: 'Currency not available.',
  BLOCKED_TRANSACTION: 'Transaction is blocked.',
  ADDRESS_ALREADY_EXISTS: 'Address already exists.',
  TRANSACTION_ALREADY_EXISTS: 'Transaction already exists.',
  TOURNAMENT_DOES_NOT_EXISTS: 'Tournament does not exist.',
  TOURNAMENT_NOT_ACTIVE: 'Tournament is not active.',
  TOURNAMENT_REGISTRATION_CLOSE: 'Tournament registration is closed.',
  INSUFFICIENT_BALANCE: 'Insufficient balance.',
  USER_ALREADY_ENROLLED_IN_TOURNAMENT: 'User already enrolled in tournament.',
  USER_ALREADY_NOT_ENROLLED_IN_TOURNAMENT: 'User is not enrolled in tournament.',
  TOURNAMENT_PLAYER_LIMIT_REACHED: 'Tournament player limit reached.',
  TOURNAMENT_REBUY_LIMIT_REACHED: 'Tournament rebuy limit reached.',
  BONUS_ALREADY_CANCELLED: 'Bonus is already cancelled.',
  BONUS_ALREADY_AVAILED: 'Bonus already availed.',
  EMAIL_ALREADY_VERIFIED: 'Email is already verified.',
  DEPOSIT_NOT_ALLOWED: 'Deposit not allowed.',
  MINIMUM_DEPOSIT_NOT_ALLOWED: 'Minimum deposit not allowed.',
  MAXIMUM_DEPOSIT_NOT_ALLOWED: 'Maximum deposit not allowed.',
  WITHDRAW_NOT_ALLOWED: 'Withdraw not allowed.',
  MINIMUM_WITHDRAW_NOT_ALLOWED: 'Minimum withdraw not allowed.',
  MAXIMUM_WITHDRAW_NOT_ALLOWED: 'Maximum withdraw not allowed.',
  PAYMENT_PROVIDER_NOT_FOUND: 'Payment provider not found.',
  NOTIFICATION_SUBSCRIPTION_EXIST: 'Notification subscription already exists.',
  PAYMENT_ERROR: 'Payment error. Please contact admin.',
  INVALID_REFERRAL_CODE: 'Invalid referral code.',
  REFERRAL_LIMIT_EXCEEDED: 'Referral limit exceeded.',
  REFERRAL_INACTIVE: 'Referral is inactive.',
  PACKAGE_NOT_FOUND: 'Package not found.',
  PACKAGE_ALREADY_EXISTS: 'Package already exists.',
  MAX_PURCHASE_LIMIT_REACHED: 'Maximum purchase limit reached.',
  PENDING_AMOE_EXISTS: 'Pending AMOE exists.',
  TRANSACTION_DOES_NOT_EXISTS: 'Transaction does not exist.',
  INVALID_OTP: 'Invalid OTP.',
  LOGIN_ATTEMPTS_EXHAUSTED: 'Login attempts exhausted.',
  SELF_EXCLUDED: 'User is self-excluded.',
  BONUS_CLAIM: 'You can only claim this bonus once every 24 hours.',
  PHONE_ALREADY_VERIFIED: 'Phone number already verified.',
  EXPIRED_OTP: 'OTP has expired.',
  WAIT_TIME: 'Please wait before retrying.',
  WRONG_OLD_PASSWORD: 'Wrong old password.',
  KYC_REQUIRED: 'KYC completion required.',
  PHONE_REQUIRED: 'Phone verification required.',
  PROFILE_REQUIRED: 'Profile details required.',
  NEW_PASSWORD_SAME_AS_OLD_PASS: 'New password cannot be same as old password.',
  SPIN_WHEEL_TIME_LIMIT: 'Spin wheel time limit not reached.',
  CLICK_ID_ALREADY_IN_USE: 'Click ID already in use.',
  ACCESS_DENIED_FROM_PLAYER_REGION: 'Access denied from your region.',
  TEMPORARY_EMAIL_ERROR: 'Temporary email error.',
  MAXIMUM_REDEEM_AMOUNT_ERROR: 'Maximum redeem amount exceeded.',
  MINIMUM_REDEEM_AMOUNT_ERROR: 'Minimum redeem amount not met.',
  SSN_REQUIRED: 'SSN is required.',
  CHAT_RAIN_ALREADY_GRABBED: 'Chat rain already grabbed.',
  MAX_CHAT_RAIN_COUNT_REACHED: 'Maximum chat rain count reached.',
  USER_WALLET_NOT_FOUND: 'User wallet not found.',
  RECEIVER_USER_DOES_NOT_EXISTS: 'Receiver user does not exist.',
  SENDER_USER_WALLET_NOT_FOUND: 'Sender user wallet not found.',
  RECEIVER_USER_WALLET_NOT_FOUND: 'Receiver user wallet not found.',
  OPT_VERIFICATION_FAILED: 'OPT verification failed.'
}

export const errorTypes = {
  RequestInputValidationErrorType: {
    name: 'RequestInputValidationError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid request data', // messages.PLEASE_CHECK_REQUEST_DATA,
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
  UserDoesNotExistsErrorType: {
    name: 'UserDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_DOES_NOT_EXISTS,
    errorCode: 3008
  },
  serviceErrorType: {
    name: 'serviceErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: false,
    description: messages.SERVICE_UNAVAILABLE,
    errorCode: 3009
  },
  BonusActivateErrorType: {
    name: 'BonusActivateErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_ACTIVATE,
    errorCode: 3009
  },
  CancelSuccessErrorType: {
    name: 'CancelSuccessErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CANCEL_SUCCESS,
    errorCode: 3010
  },
  UserInactiveErrorType: {
    name: 'UserInactiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_INACTIVE,
    errorCode: 3011
  },
  WrongPasswordErrorType: {
    name: 'WrongPasswordErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WRONG_PASSWORD,
    errorCode: 3012
  },
  EmailNotVerifiedErrorType: {
    name: 'EmailNotVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_NOT_VERIFIED,
    errorCode: 3013
  },
  UsernameOrEmailAlreadyExistsErrorType: {
    name: 'UsernameOrEmailAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USERNAME_OR_EMAIL_ALREADY_EXISTS,
    errorCode: 3014
  },
  UserNotLoggedInErrorType: {
    name: 'UserNotLoggedInErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_NOT_LOGGED_IN,
    errorCode: 3015
  },
  SessionExpiredErrorType: {
    name: 'SessionExpiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SESSION_EXPIRED,
    errorCode: 3016
  },
  UsernameIsTakenErrorType: {
    name: 'UsernameIsTakenErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USERNAME_IS_TAKEN,
    errorCode: 3017
  },
  PhoneIsTakenErrorType: {
    name: 'PhoneIsTakenErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PHONE_IS_TAKEN,
    errorCode: 3018
  },
  LimitNotFoundErrorType: {
    name: 'LimitNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LIMIT_NOT_FOUND,
    errorCode: 3019
  },
  InvalidTimeUnitErrorType: {
    name: 'InvalidTimeUnitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_TIME_UNIT,
    errorCode: 3020
  },
  InvalidValueErrorType: {
    name: 'InvalidValueErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_VALUE,
    errorCode: 3021
  },
  ExcludedPermanentlyPleaseContactProviderErrorType: {
    name: 'ExcludedPermanentlyPleaseContactProviderErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EXCLUDED_PERMANENTLY_PLEASE_CONTACT_PROVIDER,
    errorCode: 3022
  },
  InvalidEventIdCombinationErrorType: {
    name: 'InvalidEventIdCombinationErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_EVENT_ID_COMBINATION,
    errorCode: 3023
  },
  InvalidWalletIdErrorType: {
    name: 'InvalidWalletIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_WALLET_ID,
    errorCode: 3024
  },
  NotEnoughAmountErrorType: {
    name: 'NotEnoughAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOT_ENOUGH_AMOUNT,
    errorCode: 3025
  },
  AccessTokenNotFoundErrorType: {
    name: 'AccessTokenNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ACCESS_TOKEN_NOT_FOUND,
    errorCode: 3026
  },
  BettingIsDiabledErrorType: {
    name: 'BettingIsDiabledErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BETTING_IS_DIABLED,
    errorCode: 3027
  },
  MinStakeRequiredErrorType: {
    name: 'MinStakeRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MIN_STAKE_REQUIRED,
    errorCode: 3028
  },
  OddsShuldBeInRangeErrorType: {
    name: 'OddsShuldBeInRangeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ODDS_SHULD_BE_IN_RANGE,
    errorCode: 3029
  },
  InvalidBonusIdErrorType: {
    name: 'InvalidBonusIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_BONUS_ID,
    errorCode: 3032
  },
  ExcludedTemporarilyErrorType: {
    name: 'ExcludedTemporarilyErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EXCLUDED_TEMPORARILY,
    errorCode: 3033
  },
  InvalidAddressIdErrorType: {
    name: 'InvalidAddressIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_ADDRESS_ID,
    errorCode: 3034
  },
  InvalidTokenErrorType: {
    name: 'InvalidTokenErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_TOKEN,
    errorCode: 3035
  },
  WrongTokenTypeErrorType: {
    name: 'WrongTokenTypeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WRONG_TOKEN_TYPE,
    errorCode: 3036
  },
  FileDoesNotExistsErrorType: {
    name: 'FileDoesNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.FILE_DOES_NOT_EXISTS,
    errorCode: 3037
  },
  InvalidDocumentLabelIdErrorType: {
    name: 'InvalidDocumentLabelIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_DOCUMENT_LABEL_ID,
    errorCode: 3038
  },
  DocumentIsApprovedErrorType: {
    name: 'DocumentIsApprovedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DOCUMENT_IS_APPROVED,
    errorCode: 3039
  },
  InvalidDocumentIdErrorType: {
    name: 'InvalidDocumentIdErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_DOCUMENT_ID,
    errorCode: 3040
  },
  InvalidBonusErrorType: {
    name: 'InvalidBonusErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_BONUS,
    errorCode: 3041
  },
  BonusAlreadyActiveErrorType: {
    name: 'BonusAlreadyActiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_ALREADY_ACTIVE,
    errorCode: 3042
  },
  CashoutNotAllowedErrorType: {
    name: 'CashoutNotAllowedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CASHOUT_NOT_ALLOWED,
    errorCode: 3043
  },
  FileFormatNotSupportedErrorType: {
    name: 'FileFormatNotSupportedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.FILE_FORMAT_NOT_SUPPORTED,
    errorCode: 3044
  },
  DailyBetLimitExceededErrorType: {
    name: 'DailyBetLimitExceededErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DAILY_BET_LIMIT_EXCEEDED,
    errorCode: 3045
  },
  WeeklyBetLimitExceededErrorType: {
    name: 'WeeklyBetLimitExceededErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WEEKLY_BET_LIMIT_EXCEEDED,
    errorCode: 3046
  },
  MonthlyBetLimitExceededErrorType: {
    name: 'MonthlyBetLimitExceededErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MONTHLY_BET_LIMIT_EXCEEDED,
    errorCode: 3047
  },
  ServiceUnavailableErrorType: {
    name: 'ServiceUnavailableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SERVICE_UNAVAILABLE,
    errorCode: 3048
  },
  BlockedTransactionErrorType: {
    name: 'BlockedTransactionErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BLOCKED_TRANSACTION,
    errorCode: 3049
  },
  TransactionNotFoundErrorType: {
    name: 'TransactionNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TRANSACTION_DOES_NOT_EXISTS,
    errorCode: 3049
  },
  AddressAlreadyExistsErrorType: {
    name: 'AddressAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ADDRESS_ALREADY_EXISTS,
    errorCode: 3050
  },
  TournamentDoesNotExistErrorType: {
    name: 'TournamentDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_DOES_NOT_EXISTS,
    errorCode: 3049
  },
  TournamentNotActiveErrorType: {
    name: 'TournamentNotActiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_NOT_ACTIVE,
    errorCode: 3050
  },
  RegistrationEndDateErrorType: {
    name: 'RegistrationEndDateErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_REGISTRATION_CLOSE,
    errorCode: 3051
  },
  BalanceErrorType: {
    name: 'BalanceErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INSUFFICIENT_BALANCE,
    errorCode: 3053
  },
  TournamentsAlreadyEnrolledErrorType: {
    name: 'TournamentsAlreadyEnrolledErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_ALREADY_ENROLLED_IN_TOURNAMENT,
    errorCode: 3054
  },
  TournamentPlayerLimitReachedErrorType: {
    name: 'TournamentPlayerLimitReachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_PLAYER_LIMIT_REACHED,
    errorCode: 3055
  },
  NoRebuyLimitErrorType: {
    name: 'NoRebuyLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TOURNAMENT_REBUY_LIMIT_REACHED,
    errorCode: 3056
  },
  NotEnrolledInTournamentErrorType: {
    name: 'NotEnrolledInTournamentErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_ALREADY_NOT_ENROLLED_IN_TOURNAMENT,
    errorCode: 3055
  },
  ActiveBonusExistErrorType: {
    name: 'ActiveBonusExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ACTIVE_BONUS_EXISTS,
    errorCode: 3051
  },
  BonusCancelledExistErrorType: {
    name: 'BonusCancelledExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_ALREADY_CANCELLED,
    errorCode: 3052
  },
  EmailAlreadyVerifiedErrorType: {
    name: 'EmailAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EMAIL_ALREADY_VERIFIED,
    errorCode: 3052
  },
  BonusTypeAlreadyAvailedErrorType: {
    name: 'BonusTypeAlreadyAvailedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_ALREADY_AVAILED,
    errorCode: 3052
  },
  InvalidAggregatorType: {
    name: 'InvalidAggregatorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_AGGREGATOR_TYPE,
    errorCode: 3027
  },
  DepositNotAllowedErrorType: {
    name: 'DepositNotAllowedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.DEPOSIT_NOT_ALLOWED,
    errorCode: 3029
  },
  WithdrawNotAllowedErrorType: {
    name: 'WithdrawNotAllowedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WITHDRAW_NOT_ALLOWED,
    errorCode: 3029
  },
  MinimumDepositLimitErrorType: {
    name: 'MinimumDepositLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MINIMUM_DEPOSIT_NOT_ALLOWED,
    errorCode: 3030
  },
  MaximumDepositLimitErrorType: {
    name: 'MaximumDepositLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAXIMUM_DEPOSIT_NOT_ALLOWED,
    errorCode: 3031
  },
  MinimumWithdrawLimitErrorType: {
    name: 'MinimumWithdrawLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MINIMUM_WITHDRAW_NOT_ALLOWED,
    errorCode: 3032
  },
  MaximumWithdrawLimitErrorType: {
    name: 'MaximumWithdrawLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAXIMUM_WITHDRAW_NOT_ALLOWED,
    errorCode: 3033
  },
  PaymentProviderNotExistErrorType: {
    name: 'PaymentProviderNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PAYMENT_PROVIDER_NOT_FOUND,
    errorCode: 3034
  },
  NotificationSubscriptionExistErrorType: {
    name: 'NotificationSubscriptionExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NOTIFICATION_SUBSCRIPTION_EXIST,
    errorCode: 3035
  },
  PaymentGatewayErrorType: {
    name: 'SomePaymentErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PAYMENT_ERROR,
    errorCode: 3036
  },
  CurrencyNotAvailableErrorType: {
    name: 'CurrencyNotAvailableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CURRENCY_NOT_AVAILABLE,
    errorCode: 3037
  },
  InvalidReferralCodeErrorType: {
    name: 'InvalidReferralCodeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_REFERRAL_CODE,
    errorCode: 3038
  },
  ReferralLimitExceededErrorType: {
    name: 'ReferralLimitExceededErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.REFERRAL_LIMIT_EXCEEDED,
    errorCode: 3039
  },
  ThisGroupAlreadyJoinedErrorType: {
    name: 'ThisGroupAlreadyJoinedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This group already joined',
    errorCode: 3040
  },
  GroupNotExistErrorType: {
    name: 'GroupNotExist',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group not exist',
    errorCode: 3041
  },
  KycStatusErrorType: {
    name: 'KycStatusErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'You need to complete KYC to access the chat',
    errorCode: 3042
  },
  TotalWagerErrorType: {
    name: 'TotalWagerErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'total wagering leve less than required wager',
    errorCode: 3043
  },
  RankingLevelErrorType: {
    name: 'RankingLevelErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'your rank is less than required rank',
    errorCode: 3044
  },
  ReferralInActiveErrorType: {
    name: 'ReferralInActiveErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.REFERRAL_INACTIVE,
    errorCode: 3045
  },
  InvalidInputErrorType: {
    name: 'InvalidInputErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid Input',
    errorCode: 3046
  },
  ChatRainNotFoundErrorType: {
    name: 'ChatRainNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid chat rain',
    errorCode: 3047
  },
  ChatRainClosedErrorType: {
    name: 'ChatRainClosedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This chat rain has closed',
    errorCode: 3048
  },
  UserNotExistsErrorType: {
    name: 'UserNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'User Not Exists',
    errorCode: 3049
  },
  UserCanNotReportErrorType: {
    name: 'UserCanNotReportErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'You can not block youself',
    errorCode: 3050
  },
  InvalidAccessErrorType: {
    name: 'InvalidAccessErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid access',
    errorCode: 3051
  },
  ThemeNotFoundErrorType: {
    name: 'ThemeNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Theme Not Found',
    errorCode: 3052
  },
  MessageTypeMissMatchErrorType: {
    name: 'MessageTypeMissMatchErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'messageType does not match with message body',
    errorCode: 3053
  },
  ExceedChatLengthErrorType: {
    name: 'ExceedChatLengthErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Message length exceeded',
    errorCode: 3054
  },
  GroupNotJoinedByUserErrorType: {
    name: 'GroupNotJoinedByUserErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group Not joined',
    errorCode: 3055
  },
  GroupMissingrErrorType: {
    name: 'GroupMissingrErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Group not present',
    errorCode: 3056
  },
  UserDoesNotJoinedThisGroupErrorType: {
    name: 'UserDoesNotJoinedThisGroupErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'User has not joined this group',
    errorCode: 3057
  },
  ThisGroupIsNotGlobalErrorType: {
    name: 'ThisGroupIsNotGlobalErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'This group is not global',
    errorCode: 3058
  },
  MessageThreadDoestNotExistsErrorType: {
    name: 'MessageThreadDoestNotExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Message thread does not exists .',
    errorCode: 3059
  },
  InvalidTagErrorType: {
    name: 'InvalidTagErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'User does not belong to tag .',
    errorCode: 3060
  },
  PackageNotFoundErrorType: {
    name: 'PackageNotFoundErrorType',
    statusCode: StatusCodes.NOT_FOUND,
    isOperational: true,
    description: messages.PACKAGE_NOT_FOUND,
    errorCode: 3061
  },
  MaxPurchaseLimitReachedErrorType: {
    name: 'MaxPurchaseLimitReachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAX_PURCHASE_LIMIT_REACHED,
    errorCode: 3062
  },
  PendingAmoEntryAlreadyExistErrorType: {
    name: 'PendingAmoEntryAlreadyExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PENDING_AMOE_EXISTS,
    errorCode: 3063
  },
  TransactionAlreadyExistsErrorType: {
    name: 'TransactionAlreadyExistsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TRANSACTION_ALREADY_EXISTS,
    errorCode: 3064
  },
  InvalidOtpErrorType: {
    name: 'InvalidOtpErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.INVALID_OTP,
    errorCode: 3065
  },
  LoginAttemptsExhausted: {
    name: 'LoginAttemptsExhausted',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.LOGIN_ATTEMPTS_EXHAUSTED,
    errorCode: 3066
  },
  SelfExcludedErrorType: {
    name: 'SelfExcludedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SELF_EXCLUDED,
    errorCode: 3067
  },
  BonusClaimErrorType: {
    name: 'BonusClaimErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.BONUS_CLAIM,
    errorCode: 3068
  },
  PhoneAlreadyVerifiedErrorType: {
    name: 'PhoneAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PHONE_ALREADY_VERIFIED,
    errorCode: 3069
  },
  ExpiredOtpErrorType: {
    name: 'ExpiredOtpErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.EXPIRED_OTP,
    errorCode: 3070
  },
  WaitTimeErrorType: {
    name: 'WaitTimeErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WAIT_TIME,
    errorCode: 3071
  },
  WrongOldPasswordErrorType: {
    name: 'WrongOldPasswordErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.WRONG_OLD_PASSWORD,
    errorCode: 3072
  },
  KycRequiredErrorType: {
    name: 'KycRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.KYC_REQUIRED,
    errorCode: 3073
  },
  ProfileRequiredErrorType: {
    name: 'ProfileRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PROFILE_REQUIRED,
    errorCode: 3074
  },
  PhoneRequiredErrorType: {
    name: 'PhoneRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.PHONE_REQUIRED,
    errorCode: 3075
  },
  NewPasswordWithOldPasswordSame: {
    name: 'NewPasswordWithOldPasswordSame',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.NEW_PASSWORD_SAME_AS_OLD_PASS,
    errorCode: 3076
  },
  SpinWheelTimeLimitErrorType: {
    name: 'SpinWheelTimeLimitErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SPIN_WHEEL_TIME_LIMIT,
    errorCode: 3077
  },
  ClickIdAlreadyInUseErrorType: {
    name: 'ClickIdAlreadyInUseErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CLICK_ID_ALREADY_IN_USE,
    errorCode: 3078
  },
  AccessDeniedFromPlayerRegionErrorType: {
    name: 'AccessDeniedFromPlayerRegionErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.ACCESS_DENIED_FROM_PLAYER_REGION,
    errorCode: 3078
  },
  TemporaryEmailErrorType: {
    name: 'TemporaryEmailErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.TEMPORARY_EMAIL_ERROR,
    errorCode: 3079
  },
  MinimumRedeemAmountErrorType: {
    name: 'MinimumRedeemAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MINIMUM_REDEEM_AMOUNT_ERROR,
    errorCode: 3033
  },
  MaximumRedeemAmountErrorType: {
    name: 'MaximumRedeemAmountErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAXIMUM_REDEEM_AMOUNT_ERROR,
    errorCode: 3033
  },
  SsnRequiredErrorType: {
    name: 'SsnRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SSN_REQUIRED,
    errorCode: 3075
  },
  ChatRainAlreadyGrabbedErrorType: {
    name: 'ChatRainAlreadyGrabbedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.CHAT_RAIN_ALREADY_GRABBED,
    errorCode: 3080
  },
  MaxChatRainCountReachedErrorType: {
    name: 'MaxChatRainCountReachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.MAX_CHAT_RAIN_COUNT_REACHED,
    errorCode: 3081
  },
  ReceiverUserDoesNotExisterrorType: {
    name: 'ReceiverUserDoesNotExisterrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.RECEIVER_USER_DOES_NOT_EXISTS,
    errorCode: 3082
  },
  WalletNotFoundError: {
    name: 'WalletNotFoundError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.USER_WALLET_NOT_FOUND,
    errorCode: 3083
  },
  SenderWalletNotFoundError: {
    name: 'SenderWalletNotFoundError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.SENDER_USER_WALLET_NOT_FOUND,
    errorCode: 3084
  },
  ReceiverWalletNotFoundError: {
    name: 'ReceiverWalletNotFoundError',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.RECEIVER_USER_WALLET_NOT_FOUND,
    errorCode: 3085
  },
  ReceiverUserWalletDoesNotExistErrorType: {
    name: 'ReceiverUserWalletDoesNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'RECEIVER_USER_DOES_NOT_EXIST',
    errorCode: 3086
  },
  EmailTemplateNotFoundErrorType: {
    name: 'EmailTemplateNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Email Template Not Found',
    errorCode: 3087
  },
  OtpVerificationFailedErrorType: {
    name: 'OtpVerificationFailedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: messages.OPT_VERIFICATION_FAILED,
    errorCode: 3088
  },
  IdComplyKycErrorType: {
    name: 'IdComplyKycErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Issue in KYC',
    errorCode: 3089
  },
  IdComplyPendingErrorType: {
    name: 'IdComplyPendingErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'KYC status processing',
    errorCode: 3090
  },
  IdComplyAlreadyVerifiedErrorType: {
    name: 'IdComplyAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'KYC already verified',
    errorCode: 3091
  },
  PasswordRequiredErrorType: {
    name: 'PasswordRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Password is required field',
    errorCode: 3092
  },
  UpdateProfileDataToClaimDailyBonusErrorType: {
    name: 'UpdateProfileDataToClaimDailyBonusErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Update profile data to claim daily bonus.',
    errorCode: 3093
  },
  UserBalanceGreaterThanZeroErrorType: {
    name: 'UserBalanceGreaterThanZeroErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'AMOE is only available for users with no funds in their wallets. Please use up your existing funds first.',
    errorCode: 3094
  },
  PurchaseCooldownErrorType: {
    name: 'PurchaseCooldownErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Purchase cooldown period has not passed yet. Please wait before making another purchase.',
    errorCode: 3095
  },
  LimitUpdateLockedErrorType: {
    name: 'LimitUpdateLockedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'One or more limits cannot be updated until their expiry period has passed',
    errorCode: 3096
  },
  ProfileAlreadyVerifiedErrorType: {
    name: 'ProfileAlreadyVerifiedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Profile data already verified.',
    errorCode: 3096
  },
  ProfileVerificationFailedErrorType: {
    name: 'ProfileVerificationFailedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    message: 'Profile data verification failed. Please contact support to update data.',
    errorCode: 3097
  },
  JoiningBonusAlreadyClaimedErrorType: {
    name: 'JoiningBonusAlreadyClaimedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    message: 'Joining bonus already claimed.',
    errorCode: 3097
  },
  ChatSettingsNotFoundErrorType: {
    name: 'ChatSettingsNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat Settings not found.',
    errorCode: 3098
  },
  InvalidChatSettingsErrorType: {
    name: 'InvalidChatSettingsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid Chat Settings.',
    errorCode: 3099
  },
  AtLeastOneUserOrSegmentRequiredErrorType: {
    name: 'AtLeastOneUserOrSegmentRequiredErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'At least one user or segment is required.',
    errorCode: 3100
  },
  InvalidUsersErrorType: {
    name: 'InvalidUsersErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid users provided.',
    errorCode: 3101
  },
  InvalidSegmentsErrorType: {
    name: 'InvalidSegmentsErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Invalid segments provided.',
    errorCode: 3102
  },
  ChatGroupNotFoundErrorType: {
    name: 'ChatGroupNotFoundErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat group not found.',
    errorCode: 3103
  },
  GlobalGroupCannotBeDeletedErrorType: {
    name: 'GlobalGroupCannotBeDeletedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Global chat group cannot be deleted.',
    errorCode: 3104
  },
  ChatDetailIdOrGroupIdRequired: {
    name: 'ChatDetailIdOrGroupIdRequired',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Chat detail ID or group ID is required.',
    errorCode: 3105
  },
    FirstDepositNotCompletedErrorType: {
    name: 'FirstDepositNotCompletedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Please complete your first deposit to claim.',
    errorCode: 3098
  },
    NotBirthdayErrorType: {
    name: 'NotBirthdayErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Please check birthday for claim',
    errorCode: 3099
  },
  PromocodeNotExistErrorType: {
    name: 'PromocodeNotExistErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Promocode does not exist or is not active',
    errorCode: 3100
  },
  PromocodeNotApplicableErrorType: {
    name: 'PromocodeNotApplicableErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Promocode is not applicable for this package',
    errorCode: 3101
  },
  PromocodeAvailedLimitReachedErrorType: {
    name: 'PromocodeAvailedLimitReachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'Promocode usage limit has been reached',
    errorCode: 3102
  },
  PromocodePerUserLimitReachedErrorType: {
    name: 'PromocodePerUserLimitReachedErrorType',
    statusCode: StatusCodes.BAD_REQUEST,
    isOperational: true,
    description: 'You have reached the maximum usage limit for this promocode',
    errorCode: 3103
  },
}
