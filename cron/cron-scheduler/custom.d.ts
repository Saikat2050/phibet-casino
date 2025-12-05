declare namespace App {
  export interface Authenticated {
    adminUserId: string;
  }

  export interface Context {
    reqTimeStamp: string;
    traceId: string;
    sequelize: import("sequelize").Sequelize;
    logger: typeof import("@src/libs/logger").default;
    models: { [key: string]: typeof import("sequelize").Model };
    sequelizeTransaction?: import("sequelize").Transaction;
  }
}

declare namespace Nux {
  interface SessionCheck {
    token: string;
    userId: string;
  }

  interface PlayerDetails {
    token: string;
    userId: string;
  }

  interface GetBalance {
    token: string;
    userId: string;
  }

  interface MoveFunds {
    token: string;
    userId: string;
    gameId: number;
    extraData: string;
    eventId: string;
    bonusCode?: string;
    direction: "debit" | "credit";
    transactionId: string;
    eventType: "Win" | "Lose";
    time: number;
    amount: number;
  }

  interface BetFunds {
    token: string;
    userId: string;
    gameId: number;
    extraData: string;
    eventId: string;
    transactionId: string;
    eventType:
      | "betSingle"
      | "betExpress"
      | "betSystem"
      | "cancel"
      | "cashOutSimple"
      | "Tip"
      | "BetPayedAbort"
      | "BetPlacingAbort";
    time: number;
    amount: number;
  }

  interface GetUserToken {
    userId: string;
  }

  interface CloseFreespins {
    token: string;
    userId: string;
    gameId: number;
    bonusCode: string;
    isClosed: boolean;
    time: strign;
    totalAmount: number;
  }

  export interface NuxCallbackRequestData
    extends SessionCheck,
      PlayerDetails,
      GetBalance,
      MoveFunds,
      BetFunds,
      GetUserToken,
      CloseFreespins {}
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
      permssions: string[];
    }
  }
}
