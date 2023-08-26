import { v4 as uuidv4 } from 'uuid';
import {getFirestore} from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

export const addQuestionsToDB = async(questions :Array<any>)=>{

    const db = getFirestore();
    const countdata = await db.collection('questions').count().get();
    for(let item of questions){
        const newUUID = uuidv4(); 
        await  db.collection("questions").doc(`${newUUID}`).set({
            question:item.question,
            answer1:item.answers[0],
            answer2:item.answers[1],
            answer3:item.answers[2],
            answer4:item.answers[3],
            correctAnswers:item.correctAnswer,
            questionDate:admin.firestore.FieldValue.serverTimestamp()
        })
        
    }
   
}