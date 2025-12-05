declare namespace App {
  export interface Authenticated {
    userId: string;
  }

  export interface Context {
    reqTimeStamp: string;
    traceId: string;
    language: string;
    sequelize: import("sequelize").Sequelize;
    logger: typeof import("@src/libs/logger").default;
    models: { [key: string]: typeof import("sequelize").Model };
    sequelizeTransaction?: import("sequelize").Transaction;
  }
}

declare namespace Express {
  export interface Request {
    authenticated?: App.Authenticated;
    context?: App.Context;
  }
}
