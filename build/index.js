"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_1 = __importDefault(require("./app"));
const Questions_1 = __importDefault(require("../src/controller/Questions"));
const Authentication_1 = __importDefault(require("./controller/Authentication"));
const initialize_firebase_1 = require("./firebase/initialize_firebase");
const app = new app_1.default({
    port: 5000,
    controllers: [
        new Questions_1.default(),
        new Authentication_1.default()
    ],
    middleWares: [
        (0, cors_1.default)(),
        express_1.default.json({ limit: '10mb' }),
        express_1.default.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
    ],
});
(0, initialize_firebase_1.connectToFirebase)();
app.listen();
