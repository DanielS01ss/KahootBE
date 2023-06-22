import * as admin from 'firebase-admin';

export const connectToFirebase = ()=>{

    const serviceAccount = require('../../service_account/christiankahoot-firebase-adminsdk-5yk7w-2c8564bbcc.json');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://<your-project-id>.firebaseio.com'
      });
}