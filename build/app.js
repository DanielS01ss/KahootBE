"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class App {
    constructor(appInit) {
        this.app = (0, express_1.default)();
        this.port = appInit.port;
        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App has started on port ${this.port}`);
        });
    }
    middlewares(middleWares) {
        middleWares.forEach((middleware) => {
            this.app.use(middleware);
        });
    }
    routes(controllers) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }
}
exports.default = App;
