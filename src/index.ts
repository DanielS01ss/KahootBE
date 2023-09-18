import express from 'express';
import cors from 'cors';
import App from './app';
import  Questions from "./controller/Questions";
import Authentication from './controller/Authentication';
import { connectToFirebase } from './firebase/initialize_firebase';

const app = new App({
    port: 5000,
    controllers: [
      new Questions(),
      new Authentication()
    ],
    middleWares: [
      cors(),
      express.json({ limit: '10mb' }),
      express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
    ],
  });

  
  connectToFirebase();
  app.listen();