"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const firestore_1 = require("firebase-admin/firestore");
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const admin = __importStar(require("firebase-admin"));
const uuid_1 = require("uuid");
class Questions {
    constructor() {
        this.path = '/questions';
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/all', AuthMiddleware_1.default.authenticationTokenCheck, this.getAllDocuments);
        this.router.post('/get-question', AuthMiddleware_1.default.authenticationTokenCheck, this.getADocument);
        this.router.delete('/delete', AuthMiddleware_1.default.authenticationTokenCheck, this.deleteOneDocument);
        this.router.patch('/update', AuthMiddleware_1.default.authenticationTokenCheck, this.updateADocument);
        this.router.delete('/delete-all', AuthMiddleware_1.default.authenticationTokenCheck, this.deleteAll);
        this.router.post('/add-question', AuthMiddleware_1.default.authenticationTokenCheck, this.createNewQuestion);
    }
    getADocument(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationSchema = joi_1.default.object({
                questionId: joi_1.default.string().required(),
            });
            try {
                yield validationSchema.validateAsync(req.body);
            }
            catch (err) {
                console.log(err);
            }
            try {
                const db = (0, firestore_1.getFirestore)();
                const foundQuestionData = yield db.collection('questions').doc(req.body.questionId).get();
                console.log(foundQuestionData);
                const foundQuestion = {
                    question: foundQuestionData._fieldsProto.question,
                    answer1: foundQuestionData._fieldsProto.answer1,
                    answer2: foundQuestionData._fieldsProto.answer2,
                    answer3: foundQuestionData._fieldsProto.answer3,
                    answer4: foundQuestionData._fieldsProto.answer4,
                    correctAnswers: foundQuestionData._fieldsProto.correctAnswers,
                    questionDate: foundQuestionData._fieldsProto.questionDate
                };
                return res.json(foundQuestion).status(200);
            }
            catch (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        });
    }
    getAllDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, firestore_1.getFirestore)();
            const allData = [];
            yield db.collection('questions').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    allData.push({ docData: doc.data(), docId: doc.id });
                });
            }).catch((error) => {
                console.error("Error getting documents: ", error);
            });
            return res.status(200).json(allData);
        });
    }
    deleteOneDocument(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, firestore_1.getFirestore)();
            if (!req.query.id) {
                return res.sendStatus(400);
            }
            if (req.query.id.length < 9) {
                return res.sendStatus(400);
            }
            const usersRef = yield db.collection('questions').doc(`${req.query.id}`);
            try {
                yield usersRef.get()
                    .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        usersRef.onSnapshot((doc) => __awaiter(this, void 0, void 0, function* () {
                            const resp = yield db.collection('questions').doc(`${req.query.id}`).delete();
                        }));
                        res.status(200).json('OK');
                    }
                    else {
                        return res.sendStatus(404);
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    updateADocument(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, firestore_1.getFirestore)();
            const validationSchema = joi_1.default.object({
                docName: joi_1.default.string().required(),
                answer1: joi_1.default.string().min(1),
                answer2: joi_1.default.string().min(1),
                answer3: joi_1.default.string().min(1),
                answer4: joi_1.default.string().min(1),
                correctAnswers: joi_1.default.array().items(joi_1.default.string()),
                question: joi_1.default.string().min(1)
            });
            try {
                yield validationSchema.validateAsync(req.body);
            }
            catch (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            if (!req.body.docName) {
                return res.sendStatus(400);
            }
            const questionRef = db.collection('questions').doc(req.body.docName);
            if (req.body.answer1) {
                yield questionRef.update({ answer1: req.body.answer1 });
            }
            if (req.body.answer2) {
                yield questionRef.update({ answer2: req.body.answer2 });
            }
            if (req.body.answer3) {
                yield questionRef.update({ answer3: req.body.answer3 });
            }
            if (req.body.answer4) {
                yield questionRef.update({ answer4: req.body.answer4 });
            }
            if (req.body.correctAnswers) {
                yield questionRef.update({ correctAnswers: req.body.correctAnswers });
            }
            if (req.body.question) {
                yield questionRef.update({ question: req.body.question });
            }
            return res.status(200).json('');
        });
    }
    createNewQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, firestore_1.getFirestore)();
            const validationSchema = joi_1.default.object({
                answer1: joi_1.default.string().min(1).required(),
                answer2: joi_1.default.string().min(1).required(),
                answer3: joi_1.default.string().min(1).required(),
                answer4: joi_1.default.string().min(1).required(),
                correctAnswers: joi_1.default.array().items(joi_1.default.string()).required(),
                question: joi_1.default.string().min(1).required()
            });
            try {
                yield validationSchema.validateAsync(req.body);
            }
            catch (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            try {
                const newUUID = (0, uuid_1.v4)();
                const countdata = yield db.collection('questions').count().get();
                const data = yield db.collection("questions").doc(`${newUUID}`).set({
                    question: req.body.question,
                    answer1: req.body.answer1,
                    answer2: req.body.answer2,
                    answer3: req.body.answer3,
                    answer4: req.body.answer4,
                    correctAnswers: req.body.correctAnswers,
                    questionDate: admin.firestore.FieldValue.serverTimestamp()
                });
                return res.status(200).json("OK");
            }
            catch (err) {
                console.log(err);
                return res.sendStatus(500).json("Problem");
            }
        });
    }
    deleteAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, firestore_1.getFirestore)();
            try {
                db.collection("questions").get().then(res => {
                    res.forEach(element => {
                        element.ref.delete();
                    });
                });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json("Server Error");
            }
            return res.status(200).json("OK");
        });
    }
}
exports.default = Questions;
