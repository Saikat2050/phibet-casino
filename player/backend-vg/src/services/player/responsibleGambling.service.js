import ServiceBase from '../serviceBase'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  RESPONSIBLE_GAMBLING_TYPE,
  RESPONSIBLE_GAMBLING_STATUS
} from '../../utils/constants/constant'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    responsibleGamblingType: {
      type: 'string'
    },
    limitType: {
      type: 'string'
    },
    timeBreakDuration: {
      type: 'string'
    },
    selfExclusion: {
      type: 'boolean'
    },
    amount: {
      type: 'number'
    },
    sessionReminderTime: {
      type: 'number'
    }
  },
  required: ['responsibleGamblingType']
}

const constraints = ajv.compile(schema)

export class ResponsibleGambling extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      sessionReminderTime,
      limitType,
      timeBreakDuration: time,
      selfExclusion,
      responsibleGamblingType,
      amount
    } = this.args
    const currentDate = new Date()
    const timeBreakDuration = new Date(time)

    // Set the time of timeBreakDate to match the current time
    timeBreakDuration.setHours(currentDate.getHours())
    timeBreakDuration.setMinutes(currentDate.getMinutes())
    timeBreakDuration.setSeconds(currentDate.getSeconds())

    const { detail } = this.context.req.user
    const id = detail.userId

    let createStatus = 'NEW'
    const {
      ResponsibleGambling: ResponsibleGamblingModel
    } = this.context.dbModels

    const t = this.context.sequelizeTransaction
    let field, changedValue, limitTypeTime
    let originalValue = ''

    try {
      let createOrUpdateSettings = { }
      const commonSettingCheck = {
        userId: id,
        responsibleGamblingType,
        status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
      }
      if (
        responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME ||
        responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE
      ) {
        if (!limitType || !amount) {
          return this.addError('LimitTypeOrAmountRequireType')
        } else {
          // Find existing active settings for the same responsibleGamblingType
          const existingSettings = await ResponsibleGamblingModel.findAll({
            where: {
              userId: id,
              responsibleGamblingType,
              status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
            }
          })

          if (limitType === '1') { // Daily Limit
            limitTypeTime = 'daily'
            const weeklyLimit = existingSettings.find(setting => setting.limitType === '2')
            const monthlyLimit = existingSettings.find(setting => setting.limitType === '3')

            if (weeklyLimit && amount > weeklyLimit.amount) {
              return this.addError('DailyLimitExceedsWeeklyLimitType')
            }

            if (monthlyLimit && amount > monthlyLimit.amount) {
              return this.addError('DailyLimitExceedsMonthlyLimitType')
            }
          }

          if (limitType === '2') { // Weekly Limit
            limitTypeTime = 'weekly'
            const dailyLimit = existingSettings.find(setting => setting.limitType === '1')

            if (dailyLimit && amount < dailyLimit.amount) {
              return this.addError('WeeklyLimitLessThanDailyLimitType')
            }

            const monthlyLimit = existingSettings.find(setting => setting.limitType === '3')
            if (monthlyLimit && amount > monthlyLimit.amount) {
              return this.addError('WeeklyLimitExceedsMonthlyLimitType')
            }
          }

          if (limitType === '3') { // Monthly Limit
            limitTypeTime = 'monthly'
            const dailyLimit = existingSettings.find(setting => setting.limitType === '1')

            if (dailyLimit && amount < dailyLimit.amount) {
              return this.addError('MonthlyLimitLessThanDailyLimitType')
            }

            const weeklyLimit = existingSettings.find(setting => setting.limitType === '2')
            if (weeklyLimit && amount < weeklyLimit.amount) {
              return this.addError('MonthlyLimitLessThanWeeklyLimitType')
            }
          }

          if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME) field = `${limitTypeTime} time changed`
          else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE) field = `${limitTypeTime} purchase amount limit`
        }
        commonSettingCheck.limitType = limitType
        changedValue = amount

        createOrUpdateSettings = {
          userId: id,
          responsibleGamblingType,
          sessionReminderTime: null,
          limitType,
          timeBreakDuration: null,
          selfExclusion: null,
          amount
        }
      } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
        if (!selfExclusion) { return this.addError('SelfExclusionRequireType') }

        field = 'Self Exclusion'
        changedValue = selfExclusion

        createOrUpdateSettings = {
          userId: id,
          responsibleGamblingType,
          sessionReminderTime: null,
          limitType: null,
          timeBreakDuration: null,
          selfExclusion,
          amount: null
        }
      } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SESSION) {
        if (!sessionReminderTime) { return this.addError('SessionReminderTimeRequireType') }

        field = 'Session time'
        changedValue = sessionReminderTime

        createOrUpdateSettings = {
          userId: id,
          responsibleGamblingType,
          sessionReminderTime,
          limitType: null,
          timeBreakDuration: null,
          selfExclusion: null,
          amount: null
        }
      } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) {
        if (!timeBreakDuration) { return this.addError('TimeBreakDurationRequireType') }

        field = 'Take a break'
        changedValue = timeBreakDuration

        createOrUpdateSettings = {
          userId: id,
          responsibleGamblingType,
          sessionReminderTime: null,
          limitType: null,
          timeBreakDuration,
          selfExclusion: null,
          amount
        }
      }
      const existingSetting = await ResponsibleGamblingModel.findOne({
        where: commonSettingCheck
      })
      if (existingSetting) {
        if (
          responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME ||
          responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE
        ) {
          // Handle TIME or PURCHASE
          originalValue = existingSetting.amount
          const currentTime = new Date()
          const settingCreateTime = existingSetting.createdAt

          const timeDifference = (currentTime - settingCreateTime) / (60 * 60 * 1000) // Hours

          if (timeDifference >= 24) {
            // Make the old one IN_ACTIVE
            await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

            // Create a new entry with status ACTIVE
            await ResponsibleGamblingModel.create({
              ...createOrUpdateSettings,
              status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
            }, { transaction: t })

            // let time = ''
            // if (limitType === '1') {
            //   time = 'daily'
            // } else if (limitType === '2') {
            //   time = 'weekly'
            // } else if (limitType === '3') {
            //   time = 'monthly'
            // }
            // const dynamicData = await createEmailWithDynamicValues({
            //   emailType: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.RESPONSIBLE_GAMBLING_PURCHASE_LIMIT] : EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.RESPONSIBLE_GAMBLING_TIME_LIMIT],
            //   userId: detail.userId,
            //   serviceData: {
            //     subject: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? EMAIL_SUBJECTS.purchaseLimitSet : EMAIL_SUBJECTS.timeLimitSet,
            //     userName: detail.username,
            //     currentDate: new Date(),
            //     identifier: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? 'purchase' : 'time',
            //     value: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? `${time}  $${amount} ` : `${time}  ${amount} hours`
            //   },
            //   language: 'EN',
            //   t
            // })
            // await sendEmail({ id: detail.userId, email: detail.email, userName: detail.username, t, subject: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? EMAIL_SUBJECTS.purchaseLimitSet : EMAIL_SUBJECTS.timeLimitSet, emailTemplate: dynamicData })
          } else {
            // Make the new one COOLING_PERIOD
            const existingSCooling = await ResponsibleGamblingModel.findOne({
              where: {
                userId: id,
                responsibleGamblingType,
                limitType,
                status: RESPONSIBLE_GAMBLING_STATUS.COOLING_PERIOD
              }
            })
            if (!existingSCooling) {
              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.COOLING_PERIOD
              }, { transaction: t })
            } else {
              await existingSCooling.update({ amount }, { transaction: t })
            }
            createStatus = 'COOLING_PERIOD'
          }
        } else {
          // Handle other ResponsibleGamblingTypes
          if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) originalValue = existingSetting.selfExclusion
          else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SESSION) originalValue = existingSetting.sessionReminderTime
          else if (existingSetting.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) originalValue = existingSetting.timeBreakDuration

          // Make the old one IN_ACTIVE
          await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

          // Create a new entry with status ACTIVE
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
        }
      } else {
        // No existing setting found, create a new entry
        await ResponsibleGamblingModel.create({
          ...createOrUpdateSettings,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }, { transaction: t })

        if (
          responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME ||
          responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE
        ) {
          // let time = ''
          // if (limitType === '1') {
          //   time = 'daily'
          // } else if (limitType === '2') {
          //   time = 'weekly'
          // } else if (limitType === '3') {
          //   time = 'monthly'
          // }
          // const dynamicData = await createEmailWithDynamicValues({
          //   emailType: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.RESPONSIBLE_GAMBLING_PURCHASE_LIMIT] : EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.RESPONSIBLE_GAMBLING_TIME_LIMIT],
          //   userId: detail.userId,
          //   serviceData: {
          //     subject: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? EMAIL_SUBJECTS.purchaseLimitSet : EMAIL_SUBJECTS.timeLimitSet,
          //     userName: detail.username,
          //     currentDate: new Date(),
          //     identifier: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? 'purchase' : 'time',
          //     value: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? `${time}  $${amount} ` : `${time}  ${amount} hours`
          //   },
          //   language: 'EN',
          //   t
          // })
          // await sendEmail({ id: detail.userId, email: detail.email, userName: detail.username, t, subject: responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.PURCHASE ? EMAIL_SUBJECTS.purchaseLimitSet : EMAIL_SUBJECTS.timeLimitSet, emailTemplate: dynamicData })
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION) {
          // const dynamicData = await createEmailWithDynamicValues({
          //   emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.RESPONSIBLE_GAMBLING_SELF_EXCLUSION],
          //   userId: detail.userId,
          //   serviceData: {
          //     subject: EMAIL_SUBJECTS.selfExclusion,
          //     userName: detail.username,
          //     currentDate: new Date(),
          //     identifier: 'self elusion',
          //     value: ''
          //   },
          //   language: 'EN',
          //   t
          // })
          // await sendEmail({ id: detail.userId, email: detail.email, userName: detail.username, t, subject: EMAIL_SUBJECTS.selfExclusion, emailTemplate: dynamicData })
        } else if (responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK) {
          // const dynamicData = await createEmailWithDynamicValues({
          //   emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.RESPONSIBLE_GAMBLING_TAKE_A_BREAK],
          //   userId: detail.userId,
          //   serviceData: {
          //     subject: EMAIL_SUBJECTS.takeBreak,
          //     userName: detail.username,
          //     currentDate: new Date(),
          //     identifier: 'Tak a break',
          //     value: `you take a break til ${timeBreakDuration}`
          //   },
          //   language: 'EN',
          //   t
          // })
          // await sendEmail({ id: detail.userId, email: detail.email, userName: detail.username, t, subject: EMAIL_SUBJECTS.selfExclusion, emailTemplate: dynamicData })
        }
      }

      if (field && changedValue) {
        await activityLog({ userId: id, originalValue, changedValue, fieldChanged: field, transaction: t })
      }

      await t.commit()
      return { message: SUCCESS_MSG.CREATE_SUCCESS, createStatus }
    } catch (error) {
      await t.rollback()
      console.log(error, error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
