'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const tableExists = await queryInterface.sequelize.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'performance_report'
      ) AS "exists";
      `
    )

    if (!tableExists[0]?.[0].exists) {
      await queryInterface.createTable('performance_report', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        purchaseCount: {
          allowNull: true,
          type: DataTypes.INTEGER,
          fieldName: 'purchaseCount',
          _modelAttribute: true,
          field: 'purchase_count'
        },
        purchaseAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'purchaseAmount',
          _modelAttribute: true,
          field: 'purchase_amount'
        },
        purchaseGcAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'purchaseGcAmount',
          _modelAttribute: true,
          field: 'purchase_gc_amount'
        },
        pscAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'pscAmount',
          _modelAttribute: true,
          field: 'psc_amount'
        },
        bonusGcAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'bonusGcAmount',
          _modelAttribute: true,
          field: 'bonus_gc_amount'
        },
        bonusBscAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'bonusBscAmount',
          _modelAttribute: true,
          field: 'bonus_bsc_amount'
        },
        gcTotalBetAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'gcTotalBetAmount',
          _modelAttribute: true,
          field: 'gc_total_bet_amount'
        },
        gcTotalWinAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'gcTotalWinAmount',
          _modelAttribute: true,
          field: 'gc_total_win_amount'
        },
        scTotalBetAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'scTotalBetAmount',
          _modelAttribute: true,
          field: 'sc_total_bet_amount'
        },
        scTotalWinAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'scTotalWinAmount',
          _modelAttribute: true,
          field: 'sc_total_win_amount'
        },
        pendingRedeemRequestAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'pendingRedeemRequestAmount',
          _modelAttribute: true,
          field: 'pending_redeem_request_amount'
        },
        pendingRedeemRequestCount: {
          allowNull: true,
          type: DataTypes.INTEGER,
          fieldName: 'pendingRedeemRequestCount',
          _modelAttribute: true,
          field: 'pending_redeem_request_count'
        },
        failedRedeemRequestCount: {
          allowNull: true,
          type: DataTypes.INTEGER,
          fieldName: 'failedRedeemRequestCount',
          _modelAttribute: true,
          field: 'failed_redeem_request_count'
        },
        failedRedeemRequestAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'failedRedeemRequestAmount',
          _modelAttribute: true,
          field: 'failed_redeem_request_amount'
        },
        successRedeemRequestCount: {
          allowNull: true,
          type: DataTypes.INTEGER,
          fieldName: 'successRedeemRequestCount',
          _modelAttribute: true,
          field: 'success_redeem_request_count'
        },
        successRedeemRequestAmount: {
          allowNull: true,
          type: DataTypes.DOUBLE,
          fieldName: 'successRedeemRequestAmount',
          _modelAttribute: true,
          field: 'success_redeem_request_amount'
        },
        fromDate: {
          allowNull: true,
          type: DataTypes.DATE,
          fieldName: 'fromDate',
          _modelAttribute: true,
          field: 'from_date'
        },
        toDate: {
          allowNull: true,
          type: DataTypes.DATE,
          fieldName: 'toDate',
          _modelAttribute: true,
          field: 'to_date'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'updateddAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      })
      await queryInterface.addIndex('performance_report', ['from_date', 'to_date'], {
        name: 'idx_performance_report_from_to_date'
      })
      await queryInterface.addConstraint('performance_report', {
        fields: ['from_date'],
        type: 'unique',
        name: 'unique_from_date'
      })
    }

    await Promise.all([
      queryInterface.addColumn('performance_report', 'purchase_gc_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'purchaseGcCount',
        _modelAttribute: true,
        field: 'purchase_gc_count'
      }),

      queryInterface.addColumn('performance_report', 'psc_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'pscCount',
        _modelAttribute: true,
        field: 'psc_count'
      }),

      queryInterface.addColumn('performance_report', 'bonus_gc_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'bonusGcCount',
        _modelAttribute: true,
        field: 'bonus_gc_count'
      }),

      queryInterface.addColumn('performance_report', 'bonus_bsc_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'bonusBscCount',
        _modelAttribute: true,
        field: 'bonus_bsc_count'
      }),

      queryInterface.addColumn('performance_report', 'gc_total_bet_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcTotalBetCount',
        _modelAttribute: true,
        field: 'gc_total_bet_count'
      }),

      queryInterface.addColumn('performance_report', 'sc_total_bet_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'scTotalBetCount',
        _modelAttribute: true,
        field: 'sc_total_bet_count'
      }),

      queryInterface.addColumn('performance_report', 'gc_casino_bet_rollback', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'gcCasinoBetRollback',
        _modelAttribute: true,
        field: 'gc_casino_bet_rollback'
      }),

      queryInterface.addColumn('performance_report', 'gc_casino_bet_rollback_count', {
        allowNull: false,
        type: DataTypes.BIGINT,
        defaultValue: 0,
        fieldName: 'gcCasinoBetRollbackCount',
        _modelAttribute: true,
        field: 'gc_casino_bet_rollback_count'
      }),

      queryInterface.addColumn('performance_report', 'sc_casino_bet_rollback', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'scCasinoBetRollback',
        _modelAttribute: true,
        field: 'sc_casino_bet_rollback'
      }),

      queryInterface.addColumn('performance_report', 'sc_casino_bet_rollback_count', {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
        fieldName: 'scCasinoBetRollbackCount',
        _modelAttribute: true,
        field: 'sc_casino_bet_rollback_count'
      }),

      queryInterface.addColumn('performance_report', 'gc_casino_win_rollback', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'gcCasinoWinRollback',
        _modelAttribute: true,
        field: 'gc_casino_win_rollback'
      }),

      queryInterface.addColumn('performance_report', 'sc_casino_win_rollback', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'scCasinoWinRollback',
        _modelAttribute: true,
        field: 'sc_casino_win_rollback'
      }),

      queryInterface.addColumn('performance_report', 'rejected_redeem_request_amount', {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        fieldName: 'rejectedRedeemRequestAmount',
        _modelAttribute: true,
        field: 'rejected_redeem_request_amount'
      }),

      queryInterface.addColumn('performance_report', 'rejected_redeem_request_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'rejectedRedeemRequestCount',
        _modelAttribute: true,
        field: 'rejected_redeem_request_count'
      }),

      queryInterface.addColumn('performance_report', 'gc_total_win_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'gcTotalWinCount',
        _modelAttribute: true,
        field: 'gc_total_win_count'
      }),

      queryInterface.addColumn('performance_report', 'sc_total_win_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'scTotalWinCount',
        _modelAttribute: true,
        field: 'sc_total_win_count'
      }),

      queryInterface.addColumn('performance_report', 'gc_casino_win_rollback_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'gcCasinoWinRollbackCount',
        _modelAttribute: true,
        field: 'gc_casino_win_rollback_count'
      }),

      queryInterface.addColumn('performance_report', 'sc_casino_win_rollback_count', {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        fieldName: 'scCasinoWinRollbackCount',
        _modelAttribute: true,
        field: 'sc_casino_win_rollback_count'
      }),

      await queryInterface.removeColumn('performance_report', 'pending_redeem_request_amount'),
      await queryInterface.removeColumn('performance_report', 'pending_redeem_request_count')
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('performance_report', 'purchase_gc_count'),
      queryInterface.removeColumn('performance_report', 'psc_count'),
      queryInterface.removeColumn('performance_report', 'bonus_gc_count'),
      queryInterface.removeColumn('performance_report', 'bonus_bsc_count'),
      queryInterface.removeColumn('performance_report', 'gc_total_bet_count'),
      queryInterface.removeColumn('performance_report', 'sc_total_bet_count'),
      queryInterface.removeColumn('performance_report', 'gc_casino_bet_rollback'),
      queryInterface.removeColumn('performance_report', 'gc_casino_bet_rollback_count'),
      queryInterface.removeColumn('performance_report', 'sc_casino_bet_rollback'),
      queryInterface.removeColumn('performance_report', 'sc_casino_bet_rollback_count'),
      queryInterface.removeColumn('performance_report', 'gc_casino_win_rollback'),
      queryInterface.removeColumn('performance_report', 'sc_casino_win_rollback'),
      queryInterface.removeColumn('performance_report', 'rejected_redeem_request_amount'),
      queryInterface.removeColumn('performance_report', 'rejected_redeem_request_count'),
      queryInterface.removeColumn('performance_report', 'gc_total_win_count'),
      queryInterface.removeColumn('performance_report', 'sc_total_win_count'),
      queryInterface.removeColumn('performance_report', 'gc_casino_win_rollback_count'),
      queryInterface.removeColumn('performance_report', 'sc_casino_win_rollback_count')
    ])
  }
}
