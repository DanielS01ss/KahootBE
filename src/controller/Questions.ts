import express, { Request, Response, response } from 'express';
import Joi from 'joi';
import {getFirestore} from 'firebase-admin/firestore';
import authMidInstance from "../middlewares/AuthMiddleware";
import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class Questions{
    public path='/questions';

    public router = express.Router();

    constructor(){
      this.initRoutes();
    }



    private initRoutes():void{
        this.router.get('/all',authMidInstance.authenticationTokenCheck,this.getAllDocuments);
        this.router.post('/get-question',authMidInstance.authenticationTokenCheck,this.getADocument);
        this.router.delete('/delete',authMidInstance.authenticationTokenCheck,this.deleteOneDocument);
        this.router.patch('/update',authMidInstance.authenticationTokenCheck,this.updateADocument);
        this.router.delete('/delete-all',authMidInstance.authenticationTokenCheck,this.deleteAll);
        this.router.post('/add-question',authMidInstance.authenticationTokenCheck,this.createNewQuestion);
    }

    async getADocument(req:Request, res:any){
      const validationSchema = Joi.object({
        questionId:Joi.string().required(),
      });

      try{
        await validationSchema.validateAsync(req.body);
      } catch (err){
        console.log(err);
      }

      try{
        const db = getFirestore();
        const foundQuestionData:any = await  db.collection('questions').doc(req.body.questionId).get();
        console.log(foundQuestionData);
        const foundQuestion = {
          question:foundQuestionData._fieldsProto.question,
          answer1:foundQuestionData._fieldsProto.answer1,
          answer2:foundQuestionData._fieldsProto.answer2,
          answer3:foundQuestionData._fieldsProto.answer3,
          answer4:foundQuestionData._fieldsProto.answer4,
          correctAnswers:foundQuestionData._fieldsProto.correctAnswers,
          questionDate:foundQuestionData._fieldsProto.questionDate
        }
        return res.json(foundQuestion).status(200);
      } catch(err){
        console.log(err);
        return res.sendStatus(500);
      }
    }

    async getAllDocuments(req:Request,res:any){
      const db = getFirestore();
      const allData:any = [];
      await  db.collection('questions').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          allData.push({docData:doc.data(),docId:doc.id});
        });
      }).catch((error) => {
        console.error("Error getting documents: ", error);
      });

      
      return res.status(200).json(allData);
    }

    async deleteOneDocument(req:any, res:any){
      const db = getFirestore();
      
      if(!req.query.id){
        return res.sendStatus(400);
      }

      if(req.query.id.length<9){
        return res.sendStatus(400);
      }
      
      const usersRef = await db.collection('questions').doc(`${req.query.id}`);

      try{
        await usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot(async(doc) => {
              const resp = await db.collection('questions').doc(`${req.query.id}`).delete();
               
            });
            res.status(200).json('OK');
          } else {
            return  res.sendStatus(404); 
          }
      })
      } catch(err){
        console.log(err);
      }
      
  }

  async updateADocument(req:Request,res:any){
    const db = getFirestore();
    const validationSchema = Joi.object({
      docName:Joi.string().required(),
      answer1:Joi.string().min(1),
      answer2:Joi.string().min(1),
      answer3:Joi.string().min(1),
      answer4:Joi.string().min(1),
      correctAnswers:Joi.array().items(Joi.string()),
      question:Joi.string().min(1)
    });

    try {
      await validationSchema.validateAsync(req.body);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400); 
    }

    if(!req.body.docName){
      return res.sendStatus(400);
    }
    const questionRef = db.collection('questions').doc(req.body.docName);
    if(req.body.answer1){
      await questionRef.update({answer1:req.body.answer1});
    }

    if(req.body.answer2){
      await questionRef.update({answer2 : req.body.answer2});
    }

    if(req.body.answer3){
      await questionRef.update({answer3 : req.body.answer3});
    }
    
    if(req.body.answer4){
      await questionRef.update({answer4 : req.body.answer4});
    }

    if(req.body.correctAnswers){
      await questionRef.update({correctAnswers : req.body.correctAnswers});
    }

    if(req.body.question){
      await questionRef.update({question : req.body.question});
    }

    return res.status(200).json('');
  }

  async createNewQuestion(req:any,res:any){
 
    const db = getFirestore();
    const validationSchema = Joi.object({
      answer1:Joi.string().min(1).required(),
      answer2:Joi.string().min(1).required(),
      answer3:Joi.string().min(1).required(),
      answer4:Joi.string().min(1).required(),
      correctAnswers:Joi.array().items(Joi.string()).required(),
      question:Joi.string().min(1).required()
    })
    try {
      await validationSchema.validateAsync(req.body);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400); 
    }

    try{
      const newUUID = uuidv4(); 
      const countdata = await db.collection('questions').count().get();
      const data = await  db.collection("questions").doc(`${newUUID}`).set({
        question:req.body.question,
        answer1:req.body.answer1,
        answer2:req.body.answer2,
        answer3:req.body.answer3,
        answer4:req.body.answer4,
        correctAnswers:req.body.correctAnswers,
        questionDate:admin.firestore.FieldValue.serverTimestamp()
       })
       return res.status(200).json("OK");
    } catch(err){
      console.log(err);
      return res.sendStatus(500).json("Problem");
    }  
  }

  async deleteAll(req:any, res:any){
    const db = getFirestore();
    try{
      db.collection("questions").get().then(res => {
        res.forEach(element => {
          element.ref.delete();
        });
      });

    } catch(err){
      console.log(err);
      return res.status(500).json("Server Error");
    }
    
    return res.status(200).json("OK");
  }

}

export default Questions;