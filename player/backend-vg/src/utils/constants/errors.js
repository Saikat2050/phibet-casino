import { StatusCodes } from 'http-status-codes'
export const ERRORS = {
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'NotFound',
  METHOD_NOT_ALLOWED: 'MethodNotAllowed',
  BAD_DATA: 'BadData',
  BAD_REQUEST: 'BadRequest',
  INTERNAL: 'Internal',
  SERVER_ERROR: 'ServerError',
  SERVER_UNAVAILABLE: 'ServerUnavailable',
  EXPECTATION_FAILED: 'ExpectationFailed'
}

export const APP_ERROR_CODES = {
  INCORRECT_CREDENTIAL: 'The email address or password is incorrect. Please try again.',
  INVALID_TOKEN: 'Access token is invalid',
  INACTIVE_ADMIN: 'Cannot login, current user is in-active',
  USER_NOT_FOUND: 'User not found',
  EMAIL_NOT_VERIFIED: 'Email is not verified',
  INCORRECT_PASSWORD: 'Password is incorrect',
  MAX_PASSWORD_ATTEMPT: 'Maximum Password Attempts Exceeded. Please Contact Admin for Assistance.',
  USER_BANNED: 'Your Account is Banned. Please Contact Admin for Resolution',
  AUTHORIZATION_ERROR: 'Authorization required',
  EMAIL_NOT_EXIST_ERROR: 'Email address not found',
  REQUEST_ERROR: 'Too many requests, please try again later.',
  SELF_EXCLUDED: 'Your Account is Self Excluded'
}

export const ERROR_MSG = {
  SERVER_ERROR: 'Something went wrong',
  EXISTS: 'Already exists',
  NOT_FOUND: 'Record not found',
  NOT_EXISTS: 'Does not exists',
  NOT_ALLOWED: 'This action is not allowed',
  FAILED: 'Failed',
  BALANCE_ERROR: 'Insufficient balance',
  DOMAIN_ERROR: 'Domain not registered',
  WITHDRAW_ERR: 'Request Failed, request already pending',
  CURRENCY_NOT_SUBSET: 'Currency should be as per allowed configuration',
  CURRENCY_REQUIRED: 'Currency code is required',
  USERNAME_EXIST: 'Username already exists',
  EMAIL_EXIST: 'Email Address already exist',
  EXTERNAL_API_ERROR: 'External api response error',
  USER_DISABLE_UNTIL: 'User is disabled until ', // Don't remove last space
  EXCEED_DAILY_LIMIT: 'Daily bet limit reached ',
  UPDATE_DAILY_LIMIT: 'Cannot update ',
  EMAIL_TOKEN_EXPIRED: 'Email expired',
  EMAIL_VERIFIED: 'Email already verified',
  EMAIL_ERROR: 'Unable to verify your email.',
  VERIFY_EMAIL: 'Verify your email',
  SENDGRID_ERROR: 'Unable to send email.',
  RESET_PASSWORD_TOKEN_EXPIRED: 'Reset password email expired',
  TRANSACTION_FAILED: 'Transaction failed',
  UNIQUE_KEY_EXISTS: 'Unique key already exists.',
  BONUS_ISSUE: 'Bonus cannot be issued.',
  BONUS_CLAIM: 'Bonus cannot be claimed.',
  BONUS_DELETE: 'Bonus Cannot be deleted.',
  BONUS_AVAIL: 'Bonus cannot be activated, try again later',
  INVALID_BONUS: 'Amount can be issued only in Match Bonus.',
  USER_BONUS: 'Action cannot be performed, bonus is claimed by user itself.',
  ACTIVE_BONUS: 'You already have an availed bonus, to continue forfeit it first',
  LOYALTY_LEVEL_NOT_FOUND: 'Loyalty level settings not found',
  CASHBACK_ERROR: 'To claim, cash balance should be less than ',
  REQUEST_EXISTS: 'Bonus cannot be claimed, pending withdrawal requests exists.',
  TAKE_A_BREAK_DAY_ERROR: 'Days for take a break can be in range 1 to 30',
  CASHBACK_LAPSED: 'You did not have enough losses to get cashback',
  TIME_LIMIT_ERROR: 'Session Time can be set between 1 to 24',
  KYC_ERROR: 'Your KYC status is not APPROVED, you cannot perform this action',
  BONUS_VALIDITY: 'You can activate this bonus on or after ',
  LANGUAGE_NOT_ALLOWED: 'This language is not allowed',
  SESSION_ERROR: 'Invalid session or session expired',
  PAYMENT_FAILED: 'Payment Failed',
  PROVIDER_INACTIVE: 'Payment Provider is in-active or not supported for your region.',
  OTP_SEND_FAILED: 'Something went wrong.',
  EMITTER_ERROR: 'Something went wrong in socket emitting.'
}

export const ERROR_CODE = {
  TRANSACTION_FAILED: 101,
  BAD_REQUEST: 400
}

export const RequestInputValidationErrorType = {
  name: 'RequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3001
}

export const ResponseValidationErrorType = {
  name: 'ResponseInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation failed please refer json schema of response',
  errorCode: 3002
}

export const SocketRequestInputValidationErrorType = {
  name: 'SocketRequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3003
}

export const SocketResponseValidationErrorType = {
  name: 'SocketResponseValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation of socket failed please refer json schema of response',
  errorCode: 3004
}

export const InternalServerErrorType = {
  name: 'InternalServerError',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  isOperational: true,
  description: 'Internal Server Error',
  errorCode: 3005
}

export const InvalidSocketArgumentErrorType = {
  name: 'InvalidSocketArgumentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide, proper arguments eventName, [payloadObject], and [callback]',
  errorCode: 3006
}

export const EmailExistErrorType = {
  name: 'EmailExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email already exists.',
  errorCode: 3007
}

export const LoginErrorType = {
  name: 'UserInActive',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: '',
  errorCode: 3008
}

export const SelfExclusionErrorType = {
  name: 'UserInActive',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: '',
  errorCode: 3009
}

export const UnAuthorizeUserErrorType = {
  name: 'UnAuthorize',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Unauthorized ',
  errorCode: 3010
}

export const UserInActiveErrorType = {
  name: 'UserInActive',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'User Inactive',
  errorCode: 3011
}

export const InvalidTokenErrorType = {
  name: 'InvalidToken',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Either access token not passed or it is expired',
  errorCode: 3012
}

export const UserNotExistsErrorType = {
  name: 'UserNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User does not exists',
  errorCode: 3013
}

export const EmailAlreadyVerifiedErrorType = {
  name: 'EmailAlreadyVerified',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email already verified',
  errorCode: 3014
}

export const DocumentUploadError = {
  name: 'DocumentUploadError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Document Upload Error',
  errorCode: 3015
}

export const PhoneExistErrorType = {
  name: 'PhoneExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This phone number is already associated with another account. Please use a different number.',
  errorCode: 3016
}

export const UserBelow18ErrorType = {
  name: 'UserBelow18ErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Below 18 Year Error',
  errorCode: 3017
}

export const PhoneVerificationFailedErrorType = {
  name: 'PhoneVerificationFailedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong code. Please try again.',
  errorCode: 3018
}

export const PhoneAlreadyVerifiedErrorType = {
  name: 'PhoneAlreadyVerifiedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Phone Already Verified Error',
  errorCode: 3019
}

export const OtpSendErrorType = {
  name: 'OtpSendErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Otp Send Error',
  errorCode: 3020
}

export const EmailNotVerifiedErrorType = {
  name: 'EmailNotVerifiedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email Not Verified Error',
  errorCode: 3021
}

export const ResetPasswordTokenErrorType = {
  name: 'ResetPasswordTokenErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Reset Password Token Expired',
  errorCode: 3022
}

export const NewPasswordAndPasswordSameErrorType = {
  name: 'NewPasswordAndPasswordSameErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'New Password And Password Equal Error',
  errorCode: 3023
}

export const InvalidPhoneOrCodeErrorType = {
  name: 'InvalidPhoneOrCodeErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please use a valid, permanent phone number.',
  errorCode: 3024
}

export const InvalidOtpErrorType = {
  name: 'InvalidOtpErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The Code you entered is invalid. Please try again.',
  errorCode: 3025
}

export const NumberUnverifiedErrorType = {
  name: 'NumberUnverifiedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Unverified Phone Number',
  errorCode: 3026
}

export const InvalidNumberErrorType = {
  name: 'InvalidNumberErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Phone Number',
  errorCode: 3027
}

export const InvalidIdErrorType = {
  name: 'InvalidId',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Id must be a number',
  errorCode: 3028
}

export const FileSizeTooLargeErrorType = {
  name: 'FileSizeTooLargeErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File Size Too Large',
  errorCode: 3029
}

export const FileTypeNotSupportedErrorType = {
  name: 'FileTypeNotSupportedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File Type Not Supported',
  errorCode: 3030
}

export const FileNotFoundErrorType = {
  name: 'FileNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File is required',
  errorCode: 3031
}

export const GameNotFoundErrorType = {
  name: 'GameNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game not found',
  errorCode: 3032
}

export const ProviderNotFoundErrorType = {
  name: 'ProviderNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Provider not found',
  errorCode: 3033
}

export const WrongRequestInFavoriteErrorType = {
  name: 'WrongRequestInFavorite',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong Request',
  errorCode: 3039
}

export const DailyBonusNotFoundErrorType = {
  name: 'BonusNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus not found',
  errorCode: 3034
}

export const PhoneNotVerifiedErrorType = {
  name: 'PhoneNotVerified',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Phone Not Verified',
  errorCode: 3035
}

export const BonusClaimedErrorType = {
  name: 'BonusAlreadyClaimed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus Already Claimed',
  errorCode: 3036
}

export const InvalidDateErrorType = {
  name: 'InvalidDateClaimed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'End Date Must Be Greater Than Start Date',
  errorCode: 3037
}

export const InvalidOldPasswordErrorType = {
  name: 'InvalidOldPassword',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Old Password',
  errorCode: 3038
}

export const TokenRequiredErrorType = {
  name: 'TokenRequired',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'access token required for socket connection',
  errorCode: 3039
}

export const TransactionErrorType = {
  name: 'TransactionBankingError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'something went wrong',
  errorCode: 3040
}

export const MinimumBalanceErrorType = {
  name: 'MinimumBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Coins should be more than minimum redeemable coins',
  errorCode: 3041
}

export const ProviderInactiveErrorType = {
  name: 'ProviderInactiveError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Provider Is Inactive',
  errorCode: 3042
}

export const KycRequiredErrorType = {
  name: 'KycRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Account verification is required',
  errorCode: 3043
}

export const RedeemableCoinsErrorType = {
  name: 'RedeemableCoinsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient redeemable coins',
  errorCode: 3044
}

export const EmailVerificationErrorType = {
  name: 'EmailVerificationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong code. Please try again.',
  errorCode: 3045
}

export const ResendVerificationMailErrorType = {
  name: 'ResendVerificationMailError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Resend Verification Mail Failed',
  errorCode: 3046
}

export const AccessDeniedFromPlayerRegion = {
  name: 'AccessDenied',
  statusCode: StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS,
  isOperational: true,
  description: 'Platform not available from your region',
  errorCode: 3047
}

export const AccessDeniedFromPlayerVPN = {
  name: 'AccessDenied',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Platform not available under VPN',
  errorCode: 3048
}

export const AccessDeniedFromPlayerZone = {
  name: 'AccessDenied',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Platform not available for your GEO Zone',
  errorCode: 3049
}
export const EmailNotVerified = {
  name: 'EmailNotVerified',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email is not verified',
  errorCode: 3050
}
export const EmailOtpVerificationErrorType = {
  name: 'EmailOtpVerificationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong code. Please try again.',
  errorCode: 3051
}
export const UserNameExistErrorType = {
  name: 'UserNameExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'UserName already Exist',
  errorCode: 3052
}
export const UserEmailNotExistErrorType = {
  name: 'UserEmailNotExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email not found. Please try again.',
  errorCode: 3053
}

export const MaximumResendAttemptsExceededErrorType = {
  name: 'MaximumResendAttemptsExceededError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Maximum resend attempts exceeded. Please try again later.',
  errorCode: 3054
}

export const PaysafeError = {
  name: 'PaysafeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Paysafe Error',
  errorCode: 3055
}

export const FirebaseUserEmailNotFoundError = {
  name: 'FirebaseUserEMailNotFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Firebase user email not found Error.',
  errorCode: 3056
}

export const FirebaseVerificationLinkGenerateError = {
  name: 'FirebaseVerificationLinkGenerateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Firebase verification link generate error.',
  errorCode: 3057
}

export const FirebaseVerificationLinkNotSentError = {
  name: 'FirebaseVerificationLinkNotSentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Firebase verification link not sent error.',
  errorCode: 3058
}

export const SendEmailError = {
  name: 'SendEmailError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Failed to send verification mail',
  errorCode: 3059
}

export const PasswordValidationFailedError = {
  name: 'PasswordValidationFailedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Your password should contain at least 8 characters, one upper case letter, one lower case letter, one number, and one special character.',
  errorCode: 3060
}

export const VerifyEmailTokenErrorType = {
  name: 'VerifyEmailTokenErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Verify Email Token Error',
  errorCode: 3061
}

export const SendSmsError = {
  name: 'SendSmsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Failed to send verification SMS',
  errorCode: 3062
}

export const TermsAndConditionErrorType = {
  name: 'TermsAndConditionError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please accept Terms and Conditions',
  errorCode: 3063
}

export const LoginEmailErrorType = {
  name: 'LoginEmailError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Email address or Phone not found',
  errorCode: 3064
}

export const LoginPasswordErrorType = {
  name: 'LoginPasswordError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Incorrect Password',
  errorCode: 3065
}

export const UserNameRequiredErrorType = {
  name: 'UserNameRequiredErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'UserName is Required',
  errorCode: 3066
}

export const WelcomeBonusNotFoundErrorType = {
  name: 'BonusNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus not found',
  errorCode: 3067
}

export const PostalCodeNotExistError = {
  name: 'PostalCodeNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Postal Code Not Exist ',
  errorCode: 3068
}

export const SomethingWentWrongErrorType = {
  name: 'SomethingWentWrong',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Something went wrong',
  errorCode: 3069
}

export const DepositLimitErrorType = {
  name: 'DepositLimitReached',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Deposit limit reached',
  errorCode: 3070
}

export const RequestNotFoundErrorType = {
  name: 'RequestNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Redeem request not found.',
  errorCode: 3071
}

export const InvalidFileErrorType = {
  name: 'InvalidFile',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid File.',
  errorCode: 3172
}

export const UserUidExistErrorType = {
  name: 'UserUidExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User already exists.',
  errorCode: 3173
}

export const LimitTypeOrAmountRequireType = {
  name: 'LimitTypeOrAmountRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'limitType or amount require for time and purchase type',
  errorCode: 3174
}

export const SelfExclusionRequireType = {
  name: 'SelfExclusionRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'selfExclusion require self exclusion type',
  errorCode: 3175
}

export const SessionReminderTimeRequireType = {
  name: 'SessionReminderTimeRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'sessionReminder require for session type',
  errorCode: 3176
}

export const TimeBreakDurationRequireType = {
  name: 'TimeBreakDurationRequire',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'timeBreakDuration require for session TIME BREAK type',
  errorCode: 3177
}

export const MaxPasswordAttemptErrorType = {
  name: 'MaxPasswordAttemptError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Maximum Password Attempts Exceeded. Please Contact Admin for Assistance.',
  errorCode: 3178
}

export const UserAccountBannedErrorType = {
  name: 'UserAccountBannedError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Your Account is Banned. Please Contact Admin for Resolution',
  errorCode: 3179
}

export const SuccessPurchaseRequired = {
  name: 'SuccessPurchaseRequired',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Successful package purchase required',
  errorCode: 3180
}

export const MultiLoginErrorType = {
  name: 'MultiLogin',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Already login in another device ',
  errorCode: 3081
}
export const UserAccountSelfExcludedErrorType = {
  name: 'UserAccountSelfExcludedError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Your Account is Self Excluded',
  errorCode: 3179
}

export const UserBanErrorType = {
  name: 'UserBan',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'You account is banned please contact to admin',
  errorCode: 3082
}

export const UserNotExistRegisterFirstErrorType = {
  name: 'UserNotExistRegisterFirstErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User does not exist please Register first',
  errorCode: 3183
}

export const UserInActiveLoginErrorType = {
  name: 'UserInActive',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'User Inactive',
  errorCode: 3184
}

export const UserBanLoginErrorType = {
  name: 'UserAccountBannedError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Your Account is Banned. Please Contact Admin for Resolution',
  errorCode: 3185
}

export const ActionNotAllowedErrorType = {
  name: 'ActionNotAllowedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Action not allowed',
  errorCode: 3186
}

export const DailyLimitExceedsWeeklyLimitType = {
  name: 'DailyLimitExceedsWeeklyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Daily Limit Exceeds Weekly Limit',
  errorCode: 3187
}

export const DailyLimitExceedsMonthlyLimitType = {
  name: 'DailyLimitExceedsMonthlyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Daily Limit Exceeds Monthly Limit',
  errorCode: 3187
}

export const WeeklyLimitLessThanDailyLimitType = {
  name: 'WeeklyLimitLessThanDailyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Weekly Limit Less Than Daily Limit',
  errorCode: 3187
}

export const WeeklyLimitExceedsMonthlyLimitType = {
  name: 'WeeklyLimitExceedsMonthlyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Weekly LimitExceeds Monthly Limit',
  errorCode: 3187
}

export const MonthlyLimitLessThanDailyLimitType = {
  name: 'MonthlyLimitLessThanDailyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Monthly Limit Less Than Daily Limit',
  errorCode: 3187
}

export const MonthlyLimitLessThanWeeklyLimitType = {
  name: 'MonthlyLimitLessThanWeeklyLimit',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Monthly Limit Less Than Weekly Limit',
  errorCode: 3187
}

export const ResponsibleSettingNotFondType = {
  name: 'ResponsibleSettingNotFond',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Responsible Gambling Setting Not Fond',
  errorCode: 3187
}

export const UserExistWithSameDetailError = {
  name: 'UserExistWithSameDetailError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'An account already exists with these details - please contact our Customer Support.',
  errorCode: 3063
}

export const ExpiredOtpErrorType = {
  name: 'ExpiredOtp',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Your OTP has been expired. Please try again.',
  errorCode: 3025
}

export const UserSsnFailed = {
  name: 'UserSsnFailedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User ssn request failed',
  errorCode: 3063
}

export const DailyDepositTimeError = {
  name: 'DailyDepositTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not update daily deposit limit upto 24 hrs',
  errorCode: 3028
}

export const WeeklyDepositTimeError = {
  name: 'WeeklyDepositTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not update weekly deposit limit upto 24 hrs',
  errorCode: 3028
}

export const MonthlyDepositTimeError = {
  name: 'MonthlyDepositTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not update monthly deposit limit upto 24 hrs',
  errorCode: 3028
}

export const DailyBetTimeError = {
  name: 'DailyBetTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not update daily bet limit upto 24 hrs',
  errorCode: 3028
}

export const WeeklyBetTimeError = {
  name: 'WeeklyBetTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not update weekly bet limit upto 24 hrs',
  errorCode: 3028
}

export const MonthlyBetTimeError = {
  name: 'MonthlyBetTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not update monthly bet limit upto 24 hrs',
  errorCode: 3028
}

export const RecordAlreadyExistsError = {
  name: 'RecordAlreadyExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Record already exists',
  errorCode: 3028
}

export const IncompleteProfileError = {
  name: 'IncompleteProfileErrorTypeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First complete your profile',
  errorCode: 3063
}

export const SsnAlreadyApprovedError = {
  name: 'ssnAlreadyApprovedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First complete your profile',
  errorCode: 3063
}

export const YouCannotChangeYourSsnAnymoreError = {
  name: 'YouCannotChangeYourSsnAnymore',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You have reached maximum limit of updating  your SSN.',
  errorCode: 3067
}

export const UserSsnFailedError = {
  name: 'UserSSNFailedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'SSN verification failed.',
  errorCode: 3068
}

export const SsnAlreadyInProgressError = {
  name: 'SsnAlreadyInProgressError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'SSN verification already in progress !',
  errorCode: 3069
}

export const TimeBreakErrorType = {
  name: 'TimeBreakError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'You are on time break',
  errorCode: 3170
}

export const WaitTimeErrorType = {
  name: 'WaitTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please wait for 60 sec to resend OTP',
  errorCode: 3171
}

export const KYCAlreadyApprovedErrorType = {
  name: 'KYCAlreadyApprovedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Your Kyc is already verified !',
  errorCode: 3063
}

export const kycVerificationAlreadyInProgressErrorType = {
  name: 'kycVerificationAlreadyInProgressError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'KYC verification already in progress !',
  errorCode: 3069
}

export const RemoveTimeError = {
  name: 'RemoveTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can not remove limit upto 24 hrs',
  errorCode: 3028
}

export const PatternDoesNotMatchErrorType = {
  name: 'PatternDoesNotMatchError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Regex pattern check Failed!',
  errorCode: 3070
}

export const SamePasswordErrorType = {
  name: 'SamePasswordError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "New and old password can't be same",
  errorCode: 3071
}

export const PasswordDoesNotMatchErrorType = {
  name: 'PasswordDoesNotMatchError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "Password and confirm password doesn't match",
  errorCode: 3072
}

export const PhoneNumberAlreadyExistErrorType = {
  name: 'PhoneNumberAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Account associated with this phone number already exists.',
  errorCode: 3073
}

export const UserNameDoesNotExistErrorType = {
  name: 'UserNameDoesNotExistError',
  statusCode: StatusCodes.EXPECTATION_FAILED,
  isOperational: true,
  description: 'Please add a username to continue',
  errorCode: 3074
}

export const InsufficientBalanceErrorType = {
  name: 'InsufficientBalance',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient Balance',
  errorCode: 3075
}

export const PersonalBonusNotFoundErrorType = {
  name: 'PersonalBonusNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Personal bonus not found',
  errorCode: 3076
}
export const PersonalBonusAlreadyClaimedErrorType = {
  name: 'PersonalBonusAlreadyClaimed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Personal bonus already claimed',
  errorCode: 3077
}

export const PersonalBonusNotClaimedByCreateUser = {
  name: 'PersonalBonusNotClaimedByCreateUser',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Personal bonus not claimed by create user',
  errorCode: 3078
}

export const InvalidBonusCodeErrorType = {
  name: 'InvalidBonusCodeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Bonus Code',
  errorCode: 3079
}

export const AffiliatesNotExistsErrorType = {
  name: 'AffiliatesNotExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Affiliate not exist error.',
  errorCode: 3080
}

export const InvalidAffiliateCodeErrorType = {
  name: 'InvalidAffiliateCode',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Affiliate Code or Affiliate is not active',
  errorCode: 3081
}

export const EmailWithAffiliateApplied = {
  name: 'Email with this Affiliate applied',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email with this Affiliate already apply',
  errorCode: 3082
}

export const WithdrawRequestDoesNotExistErrorType = {
  name: 'WithdrawRequestDoesNotExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Withdraw request does not exists',
  errorCode: 3082
}

export const TournamentAlreadyExistWithGivenTimeFrameErrorType = {
  name: 'Tournament Already Exist With Given Time Frame Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament Not Exist Error',
  errorCode: 3083
}

export const TournamentNotFoundErrorType = {
  name: 'Tournament  Not Found Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament Not Found Error',
  errorCode: 3084
}

export const TournamentNotExistErrorType = {
  name: 'Tournament Not Exist Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament Not Exist ',
  errorCode: 3085
}

export const UserAlreadyJoinedTournamentErrorType = {
  name: 'User Already Joined Tournament Error Type',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Already Joined Tournament',
  errorCode: 3086
}

export const TournamentIsClosedForFurtherRegistrationsErrorType = {
  name: 'TournamentIsClosedForFurtherRegistrationsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Player limit has been reached for this tournament.',
  errorCode: 3087
}

export const TournamentFinishedErrorType = {
  name: 'TournamentFinishedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament is finished!',
  errorCode: 3088
}

export const PasswordCannotBeSameAsOldPasswordErrorType = {
  name: 'PasswordCannotBeSameAsOldPasswordError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Password Cannot Be Same As Old Password!',
  errorCode: 3089
}

export const UserAssociatedWithSocialLoginErrorType = {
  name: 'UserAssociatedWithSocialLoginErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please use social login to login!',
  errorCode: 3089
}

export const GiveawaysNotFoundErrorType = {
  name: 'Giveaways Not Found Error Type',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Giveaways Not Found Error',
  errorCode: 3090
}

export const NoAnyGiveawaysActive = {
  name: 'No Any Giveaways Active Error Type',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'No Any Giveaways Active Error',
  errorCode: 3091
}

export const TemporaryEmailErrorType = {
  name: 'TemporaryEmailError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'It looks like you have entered a temporary email. Please use a permanent email address.',
  errorCode: 3091
}

export const MaximumRedeemableLimitReachedErrorType = {
  name: 'MaximumRedeemableLimitReachedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Amount is higher than the maximum redeemable amount that can be requested at once.',
  errorCode: 3092
}

export const InternalUsersCannotRedeemErrorType = {
  name: 'InternalUsersCannotRedeemError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Test users cannot redeem from the platform.',
  errorCode: 3093
}

export const BonusNotFoundErrorType = {
  name: 'BonusNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus not found',
  errorCode: 3094
}

export const FirstPurchaseBonusNotFoundErrorType = {
  name: 'FirstPurchaseBonusNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Purchase Bonus Not Found',
  errorCode: 3095
}

export const FirstPurchaseBonusAlreadyClaimedErrorType = {
  name: 'FirstPurchaseBonusAlreadyClaimed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Purchase Bonus Already Claimed',
  errorCode: 3096
}

export const FirstDepositAlreadyDoneErrorType = {
  name: 'FirstDepositAlreadyDone',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Deposit Already Done',
  errorCode: 3097
}

export const InvalidSignedRequestErrorType = {
  name: 'InvalidSignedRequest',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid signed request',
  errorCode: 3098
}

export const PurchaseLimitReachedErrorType = {
  name: 'PurchasedLimitReached',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Purchase limit reached',
  errorCode: 3099
}

export const WelcomePurchaseBonusExpireErrorType = {
  name: 'WelcomePurchaseBonusExpired',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Welcome purchase bonus expire',
  errorCode: 3100
}

export const PromocodeNotExistErrorType = {
  name: 'PromocodeNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode does not exists.',
  errorCode: 3101
}

export const PromocodeAvailedLimitReachedErrorType = {
  name: 'PromocodeAvailedLimitReachedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode max users availed limit reached ',
  errorCode: 3102
}

export const PromocodePerUserLimitReachedErrorType = {
  name: 'PromocodePerUserLimitReachedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode per user limit reached ',
  errorCode: 3103
}

export const PromocodeNotApplicableErrorType = {
  name: 'PromocodeNotApplicableError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode not applicable on this package',
  errorCode: 3104
}

export const WelcomePurchasePackageIsOnlyAvailableOnceErrorType = {
  name: 'WelcomePurchasePackageIsOnlyAvailableOnceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Welcome purchase package can only be purchased once.',
  errorCode: 3100
}

export const PackageCoolDownPeriodErrorType = {
  name: 'PackageCoolDownPeriodError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Too many requests, please wait for few minutes before purchasing the package.',
  errorCode: 3101
}

export const TransactionNotFoundErrorType = {
  name: 'TransactionNotFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Transaction not found!',
  errorCode: 3101
}

export const YouCannotWithdrawMoreThanAllowedGcLimitErrorType = {
  name: 'YouCannotWithdrawMoreThanAllowedGcLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You cannot withdraw more than allowed Gc limit Error',
  errorCode: 3101
}

export const YouCannotWithdrawMoreThanAllowedScLimitErrorType = {
  name: 'YouCannotWithdrawMoreThanAllowedScLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You cannot withdraw more than allowed Sc limit Error',
  errorCode: 3102
}

export const OtpVerificationFailedErrorType = {
  name: 'OtpVerificationFailedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Otp Verification Failed Error',
  errorCode: 3103
}

export const UserNotEnabledTwoFactorAuthenticationErrorType = {
  name: 'UserNotEnabledTwoFactorAuthenticationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Not Enabled 2FA for desposit or wihtdraw vault',
  errorCode: 3104
}

export const PercentageValueShouldNotBeMoreThan100ErrorType = {
  name: 'PercentageValueShouldNotBeMoreThan100Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Percentage Value Should Not Be More Than 100',
  errorCode: 3105
}

export const IncorrectPasswordErrorType = {
  name: 'IncorrectPasswordError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Incorrect Password',
  errorCode: 3106
}

export const EnabledTwoFaTokenMustBeRequiredErrorType = {
  name: 'Enabled2faTokenMustBeRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Enabled 2fa Token Must Be Required',
  errorCode: 3107
}

export const InsufficientScBalanceErrorType = {
  name: 'InsufficientScBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient Sc Balance Error',
  errorCode: 3108
}

export const PasswordMustBeRequiredErrorType = {
  name: 'PasswordMustBeRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Password Must Be Required',
  errorCode: 3109
}

export const YourTwoFactorAuthCodeIsIncorrectErrorType = {
  name: 'Your2FACodeIsIncorrectError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Your 2FA Code Is Incorrect',
  errorCode: 3110
}

export const UserTwoFactorAuthIsDisabledErrorType = {
  name: 'UserTwoFactorAuthIsDisabledError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'UserTwoFactorAuthIsDisabled',
  errorCode: 3111
}

export const PasswordNotExistErrorType = {
  name: 'PasswordNotExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Uses Password Not Exist Error',
  errorCode: 3112
}

export const MaxAttemptForResetPasswordErrorType = {
  name: 'MaxAttemptForResetPasswordErrorType',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Maximum Password Attempts Exceeded. Please Contact Admin for Assistance.',
  errorCode: 3113
}

export const InvalidAmountErrorType = {
  name: 'InvalidAmountError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Amount.',
  errorCode: 3114
}

export const YouCannotDepositMoreThanAllowedGcLimitErrorType = {
  name: 'YouCannotDepositMoreThanAllowedGcLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You Cannot Deposit More Than Allowed GcLimit.',
  errorCode: 3115
}

export const YouCannotDepositMoreThanAllowedScLimitErrorType = {
  name: 'YouCannotDepositMoreThanAllowedScLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You Cannot Deposit More Than Allowed ScLimit Error.',
  errorCode: 3116
}

export const MaxAttemptsReachedForPhoneVerificationError = {
  name: 'MaxAttemptsReachedForPhoneVerification',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Max Attempts Reached For Phone Verification, please try after 10-15 minutes.',
  errorCode: 3117
}

export const MaxResetPasswordAttemptErrorType = {
  name: 'MaxResetPasswordAttemptErrorType',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Maximum Password Attempts Exceeded. Please Contact Admin for Assistance.',
  errorCode: 3118
}

export const EmailNotFoundErrorType = {
  name: 'EmailNotFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email is not registered, please signup!',
  errorCode: 3119
}

export const RestrictedUserErrorType = {
  name: 'RestrictedUserError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You are restricted to play games, please contact support for more information!',
  errorCode: 3120
}

export const EmailAlreadyExistErrorType = {
  name: 'EmailAlreadyExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email already exist',
  errorCode: 3121
}

export const EmailIsSameAsPreviousErrorType = {
  name: 'EmailIsSameAsPrevious',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Provided email is same as previous',
  errorCode: 3122
}

export const UserPermanentSelfExcludedErrorType = {
  name: 'UserPermanentSelfExcludedError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Your Account is Permanently Self Excluded',
  errorCode: 3123
}

export const RegistrationBlockedErrorType = {
  name: 'RegistrationBlockedErrorType',
  statusCode: StatusCodes.EXPECTATION_FAILED,
  isOperational: true,
  description: 'Currently Registrations are blocked',
  errorCode: 3124
}

export const AppleLoginFailedErrorType = {
  name: 'AppleLoginFailedErrorType',
  statusCode: StatusCodes.BAD_GATEWAY,
  isOperational: true,
  description: 'Failed to apple login. Please try again',
  errorCode: 3125
}

export const UnableToInitializePaymentErrorType = {
  name: 'UnableToInitializePaymentErrorType',
  statusCode: StatusCodes.BAD_GATEWAY,
  isOperational: true,
  description: 'Unable to initialize payment. Please try again later',
  errorCode: 3126
}

export const MinimumRedeemableCoinsErrorType = {
  name: 'MinimumRedeemableCoinsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Amount must be greater than Minimum Redeemable Coins',
  errorCode: 3127
}

export const DifferentSignUpMethodErrorType = {
  name: 'DifferentSignUpMethodErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This email is already associated with a other SignUp method',
  errorCode: 3128
}

export const SignatureMismatchErrorType = {
  name: 'SignatureMismatchErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid signature',
  errorCode: 3129
}

export const EmailAlreadyUsedErrorType = {
  name: 'EmailAlreadyUsedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email already used.',
  errorCode: 3130
}

export const UseAppropriateLoginMethodErrorType = {
  name: 'UseAppropriateLoginMethodErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please use appropriate login method to login!',
  errorCode: 3131
}

export const FinixIdentityCreationError = {
  name: 'FinixIdentityCreationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Can not create finix identity',
  errorCode: 3132
}

export const FinixPaymentInstrumentCreationError = {
  name: 'FinixPaymentInstrumentCreationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Issue in creation of payment instrument',
  errorCode: 3133
}

export const FinixPaymentFailureError = {
  name: 'FinixPaymentFailureError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Issue in finix payment',
  errorCode: 3134
}

export const FinixFraudDetectionError = {
  name: 'FinixFraudDetectionError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Fraudulent behaviour detected',
  errorCode: 3135
}

export const EmailDomainNotAllowedErrorType = {
  name: 'EmailDomainNotAllowedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email domain is not accepted.',
  errorCode: 3136
}

export const PromoCodeNotEligibleErrorType = {
  name: 'PromoCodeNotEligibleErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You are not eligible to use this promo code',
  errorCode: 3137
}

export const DeviceValidationErrorType = {
  name: 'DeviceValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Unable to verify your device. Please try again.',
  errorCode: 3138
}

export const SecurityAccessDeniedErrorType = {
  name: 'SecurityAccessDeniedError',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Access denied due to security restrictions. Please contact support if you believe this is an error.',
  errorCode: 3139
}

export const GeolocationAccessDeniedErrorType = {
  name: 'GeolocationAccessDeniedError',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Access from your current location is not permitted.',
  errorCode: 3141
}

export const MaintenanceErrorType = {
  name: 'MaintenanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Site is now in maintenance mode.',
  errorCode: 3142
}

export const TokenExpiredErrorType = {
  name: 'TokenExpiredError',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'You have been Logged out!',
  errorCode: 3010
}
