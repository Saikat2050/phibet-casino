import db, { sequelize } from '../db/models'
import { Op, QueryTypes } from 'sequelize'
import { prepareImageUrl } from '../utils/common'
import { divide, round, plus, times } from 'number-precision'
import {
  ACTION_TYPE,
  AMOUNT_TYPE,
  BONUS_TYPE,
  TRANSACTION_STATUS
} from '../utils/constants/constant'
import WalletEmitter from '../socket-resources/emitter/wallet.emitter'

export const getUserTierDetails = async (userId, recursive, sequelizeTransaction) => {
  const transactionObject = sequelizeTransaction ? { transaction: sequelizeTransaction } : {}

  const userCurrentTier = await db.UserTier.findOne({
    where: {
      userId
    },
    include: [
      {
        model: db.Tier,
        attributes: ['name', 'requiredXp', 'icon', 'level'],
        where: {
          isActive: true
        }
      }
    ],
    ...transactionObject
  })

  const userNextTier = await db.Tier.findOne({
    attributes: ['name', 'requiredXp', 'icon'],
    where: {
      level: {
        [Op.gt]: userCurrentTier.Tier.level
      },
      isActive: true
    },
    order: [['level', 'ASC']],
    ...transactionObject
  })

  userCurrentTier.Tier.icon = prepareImageUrl(userCurrentTier?.Tier?.icon)

  const [{ value: SC_TO_GC_RATE }, { value: XP_SC_TO_GC_RATE }] =
    await db.GlobalSetting.findAll({
      attributes: ['key', 'value'],
      where: {
        key: ['SC_TO_GC_RATE', 'XP_SC_TO_GC_RATE']
      }
    })

  const currentXp = +plus(+userCurrentTier.scSpend, +divide(+userCurrentTier.gcSpend, +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) > 0 ? +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) : 1)).toFixed(0)

  if (!userNextTier) {
    return {
      isMaxTier: true,
      currentTier: userCurrentTier.Tier,
      nextTier: null,
      level: +userCurrentTier.level,
      currentXp: +currentXp,
      percentage: 100
    }
  }

  userNextTier.icon = prepareImageUrl(userNextTier.icon)

  const percentage = +round(+times(+divide(+currentXp, +userNextTier.requiredXp), 100), 2)

  if (+percentage >= 100 && !recursive) {
    await updateUserTierDetail(userId)
    return getUserTierDetails(userId, (recursive = true), sequelizeTransaction)
  }

  return {
    isMaxTier: false,
    currentTier: userCurrentTier.Tier,
    nextTier: userNextTier,
    level: userCurrentTier.level,
    currentXp: +currentXp,
    percentage: percentage
  }
}

export const updateUserTierDetail = async (userId, betAmount, coin) => {
  const {
    Tier: TierModel,
    Wallet: WalletModel,
    UserTier: UserTierModel,
    GlobalSetting: GlobalSettingModel,
    CasinoTransaction: CasinoTransactionModel
  } = db

  let update = {}

  const transaction = await sequelize.transaction()

  try {
    const userCurrentTier = await UserTierModel.findOne({
      where: {
        userId
      },
      lock: { level: transaction.LOCK.UPDATE, of: UserTierModel },
      transaction
    })

    if (+betAmount && +betAmount > 0 && coin && (coin === 'SC' || coin === 'GC')) {
      coin === 'SC' ? (userCurrentTier.scSpend = +round(+plus(+userCurrentTier.scSpend, +betAmount), 2)) : (userCurrentTier.gcSpend = +round(+plus(+userCurrentTier.gcSpend, +betAmount), 2))
    }

    const [{ value: SC_TO_GC_RATE }, { value: XP_SC_TO_GC_RATE }] =
      await GlobalSettingModel.findAll({
        attributes: ['key', 'value'],
        where: {
          key: ['SC_TO_GC_RATE', 'XP_SC_TO_GC_RATE']
        }
      })

    const currentXp = +plus(+userCurrentTier.scSpend, divide(+userCurrentTier.gcSpend, +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) > 0 ? +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) : 1)).toFixed(0)

    const tierAccToXp = await TierModel.findOne({
      attributes: ['tierId', 'level'],
      where: {
        requiredXp: {
          [Op.lte]: +currentXp
        },
        isActive: true
      },
      order: [['requiredXp', 'DESC']]
    })

    if (
      +tierAccToXp.level !== +userCurrentTier.level ||
      +tierAccToXp.tierId !== +userCurrentTier.tierId
    ) {
      const [{ scSum = 0, gcSum = 0 } = {}] = await sequelize.query(
        `
      SELECT
      user_id AS "userId",
      ROUND(COALESCE(SUM(CASE WHEN amount_type = 0 THEN amount END)::numeric, 0), 2) AS "gcSum",
      ROUND(COALESCE(SUM(CASE WHEN amount_type = 1 THEN amount END)::numeric, 0), 2) AS "scSum"
      FROM
        public.casino_transactions
      WHERE
        action_type = 'bet'
        AND "tournamentId" IS NULL
        AND user_id = ${userId}
    GROUP BY 
        "userId"
      `,
        { type: QueryTypes.SELECT }
      )

      const newXp = +plus(+userCurrentTier.scSpend, +divide(+userCurrentTier.gcSpend, +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) > 0 ? +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) : 1)).toFixed(2)

      const updatedTier = await TierModel.findOne({
        attributes: ['name', 'tierId', 'level', 'bonusSc', 'bonusGc'],
        where: {
          requiredXp: {
            [Op.lte]: +newXp
          },
          isActive: true
        },
        order: [['requiredXp', 'DESC']]
      })

      if (+updatedTier.level > +userCurrentTier.level) {
        if (+updatedTier.level > +userCurrentTier.maxLevel) {
          // Award Bonus
          const userWallet = await WalletModel.findOne({
            where: { ownerId: userId },
            lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
            transaction
          })

          let balanceObj = {
            beforeScBalance: +round(
              +plus(
                +userWallet.scCoin.wsc,
                +userWallet.scCoin.psc,
                +userWallet.scCoin.bsc
              ),
              2
            ),
            beforeGcBalance: +round(+userWallet.gcCoin, 2)
          }

          userWallet.scCoin = {
            ...userWallet.scCoin,
            bsc: +round(+plus(+userWallet.scCoin.bsc, +updatedTier.bonusSc), 2)
          }

          userWallet.gcCoin = +round(
            +plus(+userWallet.gcCoin, +updatedTier.bonusGc),
            2
          )

          balanceObj = {
            ...balanceObj,
            afterScBalance: +round(
              +plus(
                +userWallet.scCoin.wsc,
                +userWallet.scCoin.psc,
                +userWallet.scCoin.bsc
              ),
              2
            ),
            afterGcBalance: +round(+userWallet.gcCoin, 2)
          }

          await userWallet.save({ transaction })

          update = {
            ...update,
            tierId: +updatedTier.tierId,
            level: +updatedTier.level,
            maxLevel: +updatedTier.level
          }

          const transactionObj = {
            userId: +userId,
            actionType: BONUS_TYPE.TIER_BONUS,
            actionId: ACTION_TYPE.CREDIT,
            status: TRANSACTION_STATUS.SUCCESS,
            walletId: userWallet.walletId,
            currencyCode: userWallet.currencyCode,
            sc: +updatedTier.bonusSc,
            gc: +updatedTier.bonusGc,
            amountType: AMOUNT_TYPE.SC_GC_COIN,
            moreDetails: balanceObj,
            roundId: 'NULL',
            transactionId: `${new Date(
              new Date().toString().split('GMT')[0] + ' UTC'
            ).toISOString()}-TRANSACTION`
          }

          await CasinoTransactionModel.create(transactionObj, { transaction })

          WalletEmitter.emitUserWalletBalance(
            {
              scCoin: +balanceObj.afterScBalance,
              gcCoin: +balanceObj.afterGcCoin,
              message: `${+updatedTier.name} Tier Unlocked !!!`
            },
            userId
          )
        } else {
          update = {
            ...update,
            tierId: +updatedTier.tierId,
            level: +updatedTier.level
          }
        }
      } else if (+updatedTier.level < +userCurrentTier.level) {
        update = {
          ...update,
          tierId: +updatedTier.tierId,
          level: +updatedTier.level
        }
      }

      update = {
        ...update,
        scSpend: +scSum,
        gcSpend: +gcSum
      }
    } else {
      update = {
        ...update,
        scSpend: +userCurrentTier.scSpend,
        gcSpend: +userCurrentTier.gcSpend
      }
    }

    await UserTierModel.update(update, {
      where: {
        userTierId: +userCurrentTier.userTierId
      },
      transaction
    })

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    throw error
  }
}
