// @flow

import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig.json';

class FirebaseService {
    constructor() {
        const config = firebaseConfig;

        firebase.initializeApp(config);

        firebase.auth().signInAnonymously().catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    }
}

const firebaseService = new FirebaseService();
export default firebaseService;
