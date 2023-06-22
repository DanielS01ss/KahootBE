"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const firestore_1 = require("firebase-admin/firestore");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConstants_1 = require("../utils/envConstants");
class Authentication {
    constructor() {
        this.path = '/auth';
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/login', this.login);
    }
    login(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationSchema = joi_1.default.object({
                username: joi_1.default.string().min(3),
                password: joi_1.default.string().min(8),
            });
            const data = { username: req.body.username };
            const signed = jsonwebtoken_1.default.sign(data, envConstants_1.ACCESS_TOKEN_SECRET, { expiresIn: '23h' });
            try {
                yield validationSchema.validateAsync(req.body);
            }
            catch (err) {
                resp.status(400);
            }
            const db = (0, firestore_1.getFirestore)();
            try {
                const mainUser = (yield db.collection('users').doc(`user1`).get()).data();
                if (mainUser && (mainUser.username != req.body.username || mainUser.password != req.body.password)) {
                    return resp.sendStatus(401);
                }
            }
            catch (err) {
                console.log(err);
                return resp.sendStatus(500);
            }
            return resp.status(200).json({ token: signed });
        });
    }
}
exports.default = Authentication;
