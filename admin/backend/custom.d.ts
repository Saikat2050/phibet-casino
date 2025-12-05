declare namespace App {
  export interface Authenticated {
    adminUserId: string;
  }

  export interface Context {
    reqTimeStamp: string;
    traceId: string;
    locale: string;
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

declare global {
  module "jsonwebtoken" {
    export interface JwtPayload {
      type: string;
      adminUserId: string;
      permissions: string[];
    }
  }
}
