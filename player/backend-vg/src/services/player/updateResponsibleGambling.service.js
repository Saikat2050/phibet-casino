import ServiceBase from '../serviceBase'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  EMAIL_TEMPLATES,
  RESPONSIBLE_GAMBLING_STATUS,
  SIGN_IN_METHOD,
  ROLE
} from '../../utils/constants/constant'
import moment from 'moment'
import { comparePassword, trackSokulEvent } from '../../utils/common'
import { sequelize } from '../../db/models'
import { sendMail } from '../../libs/sendgrid'

const schema = {
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

const constraints = ajv.compile(schema)

export class UpdateResponsibleGambling extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dailyDepositLimit,
      weeklyDepositLimit,
      monthlyDepositLimit,
      dailyBetLimit,
      weeklyBetLimit,
      monthlyBetLimit,
      selfExclusion,
      timeBreak,
      selfExclusionTimeDuration,
      password
    } = this.args

    const { detail } = this.context.req.user
    const id = detail.userId
    const {
      ResponsibleGambling: ResponsibleGamblingModel,
      User: UserModel,
      ActivityLog: ActivityLogModel
    } = this.context.dbModels

    const t = this.context.sequelizeTransaction
    let timeDifference, timeBreakDuration, field, changedValue, originalValue, remark
    let createOrUpdateSettings = { }
    let updated = false

    try {
      if (detail?.signInMethod === SIGN_IN_METHOD.NORMAL && !(await comparePassword(password, detail.password))) {
        return this.addError('LoginPasswordErrorType')
      }
      const existingSettingsAll = await ResponsibleGamblingModel.findAll({
        where: {
          userId: id,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
          isRemoved: false
        }
      })

      // if user set daily deposit limit
      if (Number(dailyDepositLimit) > 0) {
        const weekly = existingSettingsAll.find(setting => setting.limitType === '2' && setting.responsibleGamblingType === '2')?.amount
        const monthly = existingSettingsAll.find(setting => setting.limitType === '3' && setting.responsibleGamblingType === '2')?.amount

        if (Number(weekly) && Number(dailyDepositLimit) > Number(weekly)) {
          return this.addError('DailyLimitExceedsWeeklyLimitType')
        }

        if (Number(monthly) && Number(dailyDepositLimit) > Number(monthly)) {
          return this.addError('DailyLimitExceedsMonthlyLimitType')
        }

        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            limitType: '1',
            responsibleGamblingType: '2',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
            isRemoved: false
          }
        })

        createOrUpdateSettings = {
          userId: id,
          limitType: '1',
          responsibleGamblingType: '2',
          amount: +dailyDepositLimit,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          const settingCreateTime = existingSetting?.createdAt
          timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
          if (Number(existingSetting?.amount) !== Number(dailyDepositLimit)) {
            // update previous status in-active
            if (timeDifference >= 24) {
              await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }, { transaction: t })
              updated = true
            } else {
              return this.addError('DailyDepositTimeError')
            }
          }
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }
      if (Number(weeklyDepositLimit) > 0) {
        const daily = existingSettingsAll.find(setting => setting.limitType === '1' && setting.responsibleGamblingType === '2')?.amount
        const monthly = existingSettingsAll.find(setting => setting.limitType === '3' && setting.responsibleGamblingType === '2')?.amount

        if (Number(daily) && Number(weeklyDepositLimit) < Number(daily)) {
          return this.addError('WeeklyLimitLessThanDailyLimitType')
        }

        if (Number(monthly) && Number(weeklyDepositLimit) > Number(monthly)) {
          return this.addError('WeeklyLimitExceedsMonthlyLimitType')
        }

        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            limitType: '2',
            responsibleGamblingType: '2',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
            isRemoved: false
          }
        })

        createOrUpdateSettings = {
          userId: id,
          limitType: '2',
          responsibleGamblingType: '2',
          amount: +weeklyDepositLimit,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          const settingCreateTime = existingSetting?.createdAt
          timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
          if (Number(existingSetting?.amount) !== Number(weeklyDepositLimit)) {
            // update previous status in-active
            if (timeDifference >= 24) {
              await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }, { transaction: t })
              updated = true
            } else {
              return this.addError('WeeklyDepositTimeError')
            }
          }
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }
      if (Number(monthlyDepositLimit) > 0) {
        const daily = existingSettingsAll.find(setting => setting.limitType === '1' && setting.responsibleGamblingType === '2')?.amount
        const weekly = existingSettingsAll.find(setting => setting.limitType === '2' && setting.responsibleGamblingType === '2')?.amount

        if (Number(daily) && Number(monthlyDepositLimit) < Number(daily)) {
          return this.addError('MonthlyLimitLessThanDailyLimitType')
        }

        if (Number(weekly) && Number(monthlyDepositLimit) < Number(weekly)) {
          return this.addError('MonthlyLimitLessThanWeeklyLimitType')
        }

        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            limitType: '3',
            responsibleGamblingType: '2',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
            isRemoved: false
          }
        })

        createOrUpdateSettings = {
          userId: id,
          limitType: '3',
          responsibleGamblingType: '2',
          amount: +monthlyDepositLimit,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          const settingCreateTime = existingSetting?.createdAt
          timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
          if (Number(existingSetting?.amount) !== Number(monthlyDepositLimit)) {
            // update previous status in-active
            if (timeDifference >= 24) {
              await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }, { transaction: t })
              updated = true
            } else {
              return this.addError('MonthlyDepositTimeError')
            }
          }
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }
      if (Number(dailyBetLimit) > 0) {
        const weekly = existingSettingsAll.find(setting => setting.limitType === '2' && setting.responsibleGamblingType === '1')?.amount
        const monthly = existingSettingsAll.find(setting => setting.limitType === '3' && setting.responsibleGamblingType === '1')?.amount

        if (Number(weekly) && Number(dailyBetLimit) > Number(weekly)) {
          return this.addError('DailyLimitExceedsWeeklyLimitType')
        }

        if (Number(monthly) && Number(dailyBetLimit) > Number(monthly)) {
          return this.addError('DailyLimitExceedsMonthlyLimitType')
        }
        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            limitType: '1',
            responsibleGamblingType: '1',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
            isRemoved: false
          }
        })

        createOrUpdateSettings = {
          userId: id,
          limitType: '1',
          responsibleGamblingType: '1',
          amount: +dailyBetLimit,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          const settingCreateTime = existingSetting?.createdAt
          timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
          if (Number(existingSetting?.amount) !== Number(dailyBetLimit)) {
            // update previous status in-active
            if (timeDifference >= 24) {
              await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }, { transaction: t })
              updated = true
            } else {
              return this.addError('DailyBetTimeError')
            }
          }
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }
      if (Number(weeklyBetLimit) > 0) {
        const daily = existingSettingsAll.find(setting => setting.limitType === '1' && setting.responsibleGamblingType === '1')?.amount
        const monthly = existingSettingsAll.find(setting => setting.limitType === '3' && setting.responsibleGamblingType === '1')?.amount

        if (Number(daily) && Number(weeklyBetLimit) < Number(daily)) {
          return this.addError('WeeklyLimitLessThanDailyLimitType')
        }

        if (Number(monthly) && Number(weeklyBetLimit) > Number(monthly)) {
          return this.addError('WeeklyLimitExceedsMonthlyLimitType')
        }
        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            limitType: '2',
            responsibleGamblingType: '1',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
            isRemoved: false
          }
        })

        createOrUpdateSettings = {
          userId: id,
          limitType: '2',
          responsibleGamblingType: '1',
          amount: +weeklyBetLimit,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          const settingCreateTime = existingSetting?.createdAt
          timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
          if (Number(existingSetting?.amount) !== Number(weeklyBetLimit)) {
            // update previous status in-active
            if (timeDifference >= 24) {
              await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }, { transaction: t })
              updated = true
            } else {
              return this.addError('WeeklyBetTimeError')
            }
          }
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }
      if (Number(monthlyBetLimit) > 0) {
        const daily = existingSettingsAll.find(setting => setting.limitType === '1' && setting.responsibleGamblingType === '1')?.amount
        const weekly = existingSettingsAll.find(setting => setting.limitType === '2' && setting.responsibleGamblingType === '1')?.amount

        if (Number(daily) && Number(monthlyBetLimit) < Number(daily)) {
          return this.addError('MonthlyLimitLessThanDailyLimitType')
        }

        if (Number(weekly) && Number(monthlyBetLimit) < Number(weekly)) {
          return this.addError('MonthlyLimitLessThanWeeklyLimitType')
        }
        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            limitType: '3',
            responsibleGamblingType: '1',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
            isRemoved: false
          }
        })

        createOrUpdateSettings = {
          userId: id,
          limitType: '3',
          responsibleGamblingType: '1',
          amount: +monthlyBetLimit,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          const settingCreateTime = existingSetting?.createdAt
          timeDifference = (new Date() - new Date(settingCreateTime)) / (60 * 60 * 1000) // Hours
          if (Number(existingSetting?.amount) !== Number(monthlyBetLimit)) {
            // update previous status in-active
            if (timeDifference >= 24) {
              await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

              await ResponsibleGamblingModel.create({
                ...createOrUpdateSettings,
                status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
              }, { transaction: t })
              updated = true
            } else {
              return this.addError('MonthlyBetTimeError')
            }
          }
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }

      if (Number(timeBreak) > 0) {
        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            responsibleGamblingType: '4',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }
        })

        timeBreakDuration = new Date()
        const newDate = timeBreakDuration.getDate() + +(timeBreak)
        timeBreakDuration.setDate(newDate)

        createOrUpdateSettings = {
          userId: id,
          timeBreakDuration,
          responsibleGamblingType: '4',
          amount: +timeBreak,
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
        }

        if (existingSetting) {
          await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })

          updated = true
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
      }

      if (selfExclusion === 'yes') {
        let exclusionDuration = null
        if (selfExclusionTimeDuration === '24Hours') {
          exclusionDuration = moment().add(24, 'hours')
        } else if (selfExclusionTimeDuration === '72Hours') {
          exclusionDuration = moment().add(72, 'hours')
        } else if (selfExclusionTimeDuration === '7Days') {
          exclusionDuration = moment().add(7, 'days')
        } else if (selfExclusionTimeDuration === '30Days') {
          exclusionDuration = moment().add(30, 'days')
        } else if (selfExclusionTimeDuration === '6Months') {
          exclusionDuration = moment().add(6, 'months')
        } else if (selfExclusionTimeDuration === '1Year') {
          exclusionDuration = moment().add(1, 'year')
        }
        const existingSetting = await ResponsibleGamblingModel.findOne({
          where: {
            userId: id,
            responsibleGamblingType: '5',
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }
        })

        createOrUpdateSettings = {
          userId: id,
          selfExclusion: true,
          responsibleGamblingType: '5',
          status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE,
          permanentSelfExcluded: selfExclusionTimeDuration === 'indefinitely'
        }
        changedValue = selfExclusionTimeDuration === 'indefinitely' ? 'Permanent' : selfExclusionTimeDuration
        remark = selfExclusionTimeDuration === 'indefinitely' ? 'Permanent' : selfExclusionTimeDuration
        if (exclusionDuration) {
          createOrUpdateSettings.timeBreakDuration = exclusionDuration
        }
        originalValue = existingSetting?.exclusionDuration
        field = 'Self Exclusion'

        if (existingSetting) {
          await existingSetting.update({ status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }, { transaction: t })

          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })

          updated = true
        } else {
          await ResponsibleGamblingModel.create({
            ...createOrUpdateSettings,
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          }, { transaction: t })
          updated = true
        }
        await UserModel.update(
          {
            moreDetails: sequelize.literal(
              `jsonb_set(
                COALESCE(more_details, '{}'::jsonb), 
                '{sokulPlayerActive}', 
                'false'::jsonb
              )`
            )
          },
          { where: { userId: id }, transaction: t }
        )
      }

      if (field && changedValue) {
        await ActivityLogModel.create({
          actioneeId: detail.userId,
          actioneeType: ROLE.USER,
          fieldChanged: field,
          originalValue,
          changedValue,
          userId: detail.userId,
          remark,
          moreDetails: { favorite: false }
        }, { transaction: t })
      }

      await t.commit()
      if (selfExclusion === 'yes') {
        await sendMail({
          email: detail.email,
          userId: detail.userId,
          emailTemplate: EMAIL_TEMPLATES.SELF_EXCLUSION,
          dynamicData: {
            name: detail.firstName && detail.lastName ? detail.firstName + ' ' + detail.lastName : detail.firstName || 'User',
            amount: selfExclusionTimeDuration === '24Hours' ? '24 Hours' : selfExclusionTimeDuration === '72Hours' ? '72 Hours' : selfExclusionTimeDuration === '7Days' ? '7 Days' : selfExclusionTimeDuration === '30Days' ? '30 Days' : selfExclusionTimeDuration === '6Months' ? '6 Months' : selfExclusionTimeDuration === '1Year' ? '1 Year' : 'Permanent'
          }
        })
      }

      if (updated) {
        if (Number(timeBreak) > 0) {
          return { message: SUCCESS_MSG.CREATE_SUCCESS, timebreak: true, isUpdated: true }
        } else if (selfExclusion === 'yes') {
          await trackSokulEvent({ email: detail?.email, status: 'other' }, 'updateUser')
          return { message: SUCCESS_MSG.CREATE_SUCCESS, selfExcluded: true, isUpdated: true }
        } else {
          return { message: SUCCESS_MSG.CREATE_SUCCESS, isUpdated: true }
        }
      } else {
        return { message: 'Record Already Exists', isUpdated: false }
      }
    } catch (error) {
      await t.rollback()
      console.log('error', error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
