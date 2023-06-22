import Joi from 'joi';
import {getFirestore} from 'firebase-admin/firestore';
import express, { Request, Response, response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../utils/envConstants';

class Authentication{

    public path='/auth';

    public router = express.Router();

    constructor(){
        this.initRoutes();
    }

    private initRoutes():void{
        this.router.post('/login',this.login);
    }

    async login(req: any, resp: any){
        const validationSchema = Joi.object({
          username: Joi.string().min(3),
          password: Joi.string().min(8),
        });
        const data = {username:req.body.username};

        const signed = jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: '23h' });

        try {
          await validationSchema.validateAsync(req.body);
        } catch (err) {
          resp.status(400);
        }

        const db = getFirestore();
    
        try {
            const mainUser = (await db.collection('users').doc(`user1`).get()).data();
            if(mainUser && (mainUser.username != req.body.username || mainUser.password != req.body.password))
            {
                return resp.sendStatus(401);
            }
            
        } catch (err) {
          console.log(err);
          return resp.sendStatus(500);
        }

        return resp.status(200).json({token:signed});
        
      }

}

export default Authentication;