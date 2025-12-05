module.exports = (sequelize, DataTypes) => {
  const ServerLog = sequelize.define(
    'ServerLog',
    {
      serverLogId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      originalUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      route: {
        type: DataTypes.STRING,
        allowNull: true
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      params: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      query: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      bodyType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      body: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      headers: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referrer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      response: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'server_logs',
      schema: 'public',
      timestamps: false,
      underscored: true
    }
  )

  return ServerLog
}
