import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../utils/envConstants';

class AuthMiddleware {
  public static authMidd: AuthMiddleware;

  static getInstance(): AuthMiddleware {
    if (!this.authMidd) this.authMidd = new AuthMiddleware();
    return this.authMidd;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
  authenticationTokenCheck(req: Request, resp: Response, next: NextFunction): any {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null || token === undefined) return resp.sendStatus(401);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    if (token) {
      // eslint-disable-next-line consistent-return
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {
        console.log(err);
        if (err) return resp.sendStatus(403);
        next();
      });
    }
  }
}

const authMidInstance: AuthMiddleware = AuthMiddleware.getInstance();
export default authMidInstance;