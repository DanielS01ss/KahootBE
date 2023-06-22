"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConstants_1 = require("../utils/envConstants");
class AuthMiddleware {
    static getInstance() {
        if (!this.authMidd)
            this.authMidd = new AuthMiddleware();
        return this.authMidd;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    authenticationTokenCheck(req, resp, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null || token === undefined)
            return resp.sendStatus(401);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        if (token) {
            // eslint-disable-next-line consistent-return
            jsonwebtoken_1.default.verify(token, envConstants_1.ACCESS_TOKEN_SECRET, (err) => {
                console.log(err);
                if (err)
                    return resp.sendStatus(403);
                next();
            });
        }
    }
}
const authMidInstance = AuthMiddleware.getInstance();
exports.default = authMidInstance;
