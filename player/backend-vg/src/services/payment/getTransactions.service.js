import moment from 'moment'
import ajv from '../../libs/ajv'
import { QueryTypes } from 'sequelize'
import ServiceBase from '../serviceBase'
import { sequelize } from '../../db/models'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { BONUS_TYPE, TRANSACTION_STATUS } from '../../utils/constants/constant'

const schema = {
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
    actionType: {
      type: 'string',
      enum: ['deposit', 'redeem', 'bonus', 'vault', 'all']
    },
    status: {
      type: 'string',
      enum: ['pending', 'success', 'cancelled', 'inprogress', 'all']
    },
    coinType: {
      type: 'string',
      enum: ['SC', 'GC', 'all']
    }
  },
  required: ['actionType']
}

const constraints = ajv.compile(schema)

export class GetTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { userId } = this.context.req.user.detail
      let { endDate = null, startDate = null, page, limit, actionType, status, coinType } = this.args

      if (!startDate) {
        const newDate = new Date()
        newDate.setDate(newDate.getDate() - 7)
        startDate = new Date(newDate.setHours(0, 0, 0, 0)).toISOString()
        endDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
      }

      if (moment(startDate) > moment(endDate)) {
        return this.addError('InvalidDateErrorType')
      }

      startDate = new Date(startDate).toISOString()
      endDate = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString()

      const { pageNo, size } = pageValidation(page, limit)

      const allTransactionsOptions = {
        replacements: {
          user_id: userId,
          startDate,
          endDate
        },
        type: QueryTypes.SELECT
      }
      const amountTypeConditions = coinType === 'all' ? '' : coinType === 'GC' ? 'AND amount_type = 0' : 'AND amount_type = 1'

      let bankingTransactionType = ''
      let bonusTransactionType = ''
      let withdrawQuery = ''
      let statusQuery = ''
      if (actionType === 'all') {
        bankingTransactionType = "'deposit'"
        bonusTransactionType = `'${BONUS_TYPE.DAILY_BONUS}','${BONUS_TYPE.WELCOME_BONUS}', '${BONUS_TYPE.REFERRAL_BONUS}', '${BONUS_TYPE.PERSONAL_BONUS}', 'tournament', '${BONUS_TYPE.TIER_BONUS}', '${BONUS_TYPE.MONTHLY_TIER_BONUS}', '${BONUS_TYPE.WEEKLY_TIER_BONUS}', '${BONUS_TYPE.RAFFLE_PAYOUT}', '${BONUS_TYPE.PROMOTION_BONUS}', '${BONUS_TYPE.AFFILIATE_BONUS}', '${BONUS_TYPE.FIRST_PURCHASE_BONUS}', '${BONUS_TYPE.WHEEL_SPIN_BONUS}', '${BONUS_TYPE.PACKAGE_BONUS}'`
      } else if (actionType === 'deposit') {
        bankingTransactionType = "'deposit'"
      } else if (actionType === 'bonus') {
        bonusTransactionType = `'${BONUS_TYPE.DAILY_BONUS}','${BONUS_TYPE.WELCOME_BONUS}', '${BONUS_TYPE.REFERRAL_BONUS}', '${BONUS_TYPE.PERSONAL_BONUS}', 'tournament', '${BONUS_TYPE.TIER_BONUS}', '${BONUS_TYPE.MONTHLY_TIER_BONUS}', '${BONUS_TYPE.WEEKLY_TIER_BONUS}', '${BONUS_TYPE.RAFFLE_PAYOUT}', '${BONUS_TYPE.PROMOTION_BONUS}', '${BONUS_TYPE.AFFILIATE_BONUS}', '${BONUS_TYPE.FIRST_PURCHASE_BONUS}', '${BONUS_TYPE.WHEEL_SPIN_BONUS}', '${BONUS_TYPE.PACKAGE_BONUS}'`
      } else if (actionType === 'vault') {
        bankingTransactionType = "'vaultDeposit', 'vaultWithdraw'"
      } else if (actionType === 'admin') {
        bankingTransactionType = "'addGc', 'addSc'"
      }
      if (status && status !== 'all') {
        statusQuery = `AND status = ${TRANSACTION_STATUS[status.toUpperCase()]}`
      }
      if (actionType === 'all' || actionType === 'redeem' || status === 'all' || coinType === 'SC' || (status && status !== 'all')) {
        withdrawQuery = `SELECT updated_at, created_at, 'Redemption' AS transactionType, status, amount, '' as flag, amount as scCoin, 0 AS gcCoin, payment_provider as method, transaction_id::varchar as transactionId, actionable_email as redeemEmail FROM withdraw_requests WHERE user_id = :user_id AND status <> 11 AND updated_at >= :startDate AND updated_at <= :endDate ${statusQuery}  UNION ALL `
      }

      const totalCount = await sequelize.query(
        `SELECT COUNT(*) FROM (SELECT updated_at, created_at, transaction_type as transactionType, status, amount, '' as flag, sc_coin as scCoin, gc_coin as gcCoin, payment_method as method, '' as transactionId, '' as redeemEmail FROM transaction_bankings WHERE actionee_id = :user_id AND updated_at >= :startDate AND updated_at <= :endDate AND status <> 11 AND transaction_type IN (${
          bankingTransactionType || 'null'
        }) UNION ALL ` +
          withdrawQuery +
          `SELECT updated_at,created_at, action_type as transactionType, status, amount, '' as flag, sc as scCoin, gc as gcCoin, '' as method, '' as transactionId, '' as redeemEmail FROM casino_transactions WHERE user_id = :user_id AND updated_at >= :startDate AND updated_at <= :endDate AND action_type IN (${
            bonusTransactionType || 'null'
          }) ) as t`,
        allTransactionsOptions
      )

      const myTransactions = await sequelize.query(
        `SELECT * FROM ( SELECT updated_at, created_at, (CASE WHEN transaction_type = 'deposit' THEN 'Purchase' WHEN transaction_type = 'redeem' THEN 'redeem' WHEN transaction_type = 'vaultDeposit' THEN 'Vault Deposit' WHEN transaction_type = 'vaultWithdraw' THEN 'Vault Withdraw' ELSE '' END) as transactionType, status, amount, '' as flag, sc_coin as scCoin, gc_coin as gcCoin, payment_method as method, transaction_id::varchar as transactionId, '' as redeemEmail FROM transaction_bankings WHERE actionee_id = :user_id AND updated_at >= :startDate AND updated_at <= :endDate AND status <> 11 AND transaction_type IN (${
          bankingTransactionType || 'null'
        }) UNION ALL ` +
          withdrawQuery +
          `SELECT updated_at,created_at, (CASE WHEN action_type = 'daily-bonus' THEN 'daily bonus' WHEN action_type = 'welcome bonus' THEN 'welcome bonus' WHEN action_type = 'referral-bonus' THEN 'Referral Bonus' WHEN action_type = 'personal-bonus' THEN 'Personal Bonus' WHEN action_type = 'tournament' THEN 'Tournament' WHEN action_type = 'tier-bonus' THEN 'Tier Bonus' WHEN action_type = 'weekly-tier-bonus' THEN 'Weekly Tier Bonus' WHEN action_type = 'monthly-tier-bonus' THEN 'Monthly Tier Bonus' WHEN action_type = 'raffle-payout' THEN 'Giveaway Bonus' WHEN action_type = 'promotion-bonus' THEN 'Promotion Bonus' WHEN action_type = 'affiliate-bonus' THEN 'Affiliate Bonus' WHEN action_type = 'first-purchase-bonus' THEN 'First Purchase Bonus' WHEN action_type = 'wheel-spin-bonus' THEN 'Wheel Spin Bonus' WHEN action_type = 'package-bonus' THEN 'Package Bonus' ELSE '' END) as transactionType, status, amount, (CASE WHEN action_id = '0' THEN 'Debit' WHEN action_id = '1' THEN 'Credit' ELSE NULL END) as flag, sc as scCoin, gc as gcCoin, NULL as method, NULL as transactionId, '' as redeemEmail FROM casino_transactions WHERE user_id = :user_id AND updated_at >= :startDate AND updated_at <= :endDate ${amountTypeConditions}  AND action_type IN (${
            bonusTransactionType || 'null'
          }) ) as t ORDER BY updated_at DESC LIMIT :size OFFSET :offset`,
        {
          ...allTransactionsOptions,
          replacements: {
            ...allTransactionsOptions.replacements,
            size,
            offset: size * (pageNo - 1)
          }
        }
      )

      return {
        data: { rows: myTransactions, count: +totalCount[0]?.count || 0 } || {},
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log('*****************************************', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
