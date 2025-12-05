import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { NumberPrecision } from '@src/libs/numberPrecision'
import ServiceBase from '@src/libs/serviceBase'
import { CURRENCY_TYPES, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { CreateTransactionService } from '../transaction/createTransaction.service'
import bcrypt from 'bcrypt'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    coinType: { enum: [...Object.values(CURRENCY_TYPES)] },
    amount: { type: 'number', minimum: 1 },
    vaultPurpose: { enum: [LEDGER_PURPOSE.VAULT_DEPOSIT, LEDGER_PURPOSE.VAULT_REDEEM] },
    password: { type: 'string' }
  },
  required: ['userId', 'coinType', 'amount', 'vaultPurpose']
})

export class VaultService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, coinType, vaultPurpose, password } = this.args
    let amount = this.args.amount

    try {
      if (vaultPurpose === LEDGER_PURPOSE.VAULT_REDEEM && !password) return this.addError('PasswordRequiredErrorType')
      const wallets = await sequelize.query(`
        SELECT
          w.id,
          w.amount,
          w.currency_id,
          w.vault_amount,
          u.password,
          c.type,
         SUM(CASE WHEN c.type = :coinType THEN w.amount ELSE 0 END) OVER () AS totalAmount,
         SUM(CASE WHEN c.type = :coinType THEN w.vault_amount ELSE 0 END) OVER () AS totalVaultAmount
        FROM wallets w
        INNER JOIN currencies c ON c.id = w.currency_id
        INNER JOIN users u ON u.id = w.user_id
        WHERE w.user_id = :userId AND c.type = :coinType
      `, {
        replacements: { userId, coinType },
        type: sequelize.QueryTypes.SELECT
      })

      if (vaultPurpose === LEDGER_PURPOSE.VAULT_REDEEM) {
        const passwordMatch = await bcrypt.compare(password, wallets[0].password)
        if (!passwordMatch) {
          return this.addError('WrongPasswordErrorType')
        }
      }

      if (wallets.length && ((vaultPurpose === LEDGER_PURPOSE.VAULT_DEPOSIT && wallets[0].totalamount < amount) || (vaultPurpose === LEDGER_PURPOSE.VAULT_REDEEM && wallets[0].totalvaultamount < amount))) {
        return this.addError('NotEnoughAmountErrorType')
      }

      for (const wallet of wallets) {
        if (amount > 0) {
          const transactionData = {
            currencyId: wallet.currency_id,
            purpose: vaultPurpose,
            userId,
            amount: 0,
            vaultAmount: 0,
            wallet
          }

          if (vaultPurpose === LEDGER_PURPOSE.VAULT_DEPOSIT && wallet.amount > 0) {
            if (amount > wallet.amount) {
              transactionData.amount = 0
              transactionData.vaultAmount = NumberPrecision.plus(wallet.vault_amount, wallet.amount)
              transactionData.ledgerAmount = wallet.amount
              amount = NumberPrecision.minus(amount, wallet.amount)
            } else if (amount <= wallet.amount) {
              transactionData.amount = NumberPrecision.minus(wallet.amount, amount)
              transactionData.vaultAmount = NumberPrecision.plus(wallet.vault_amount, amount)
              transactionData.ledgerAmount = amount
              amount = 0
            }
            await CreateTransactionService.execute(transactionData, this.context)
          } else if (vaultPurpose === LEDGER_PURPOSE.VAULT_REDEEM && wallet.vault_amount > 0) {
            if (amount > wallet.vault_amount) {
              transactionData.vaultAmount = 0
              transactionData.amount = NumberPrecision.plus(wallet.amount, wallet.vault_amount)
              transactionData.ledgerAmount = wallet.vault_amount
              amount = NumberPrecision.minus(amount, wallet.vault_amount)
            } else if (amount <= wallet.vault_amount) {
              transactionData.vaultAmount = NumberPrecision.minus(wallet.vault_amount, amount)
              transactionData.ledgerAmount = amount
              transactionData.amount = NumberPrecision.plus(wallet.amount, amount)
              amount = 0
            }
            await CreateTransactionService.execute(transactionData, this.context)
          }
        }
      }

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
