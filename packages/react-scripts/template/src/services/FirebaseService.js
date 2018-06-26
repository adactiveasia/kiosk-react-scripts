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

        window.firebaseService = this;
    }

    getData(key) {
        return firebase.database().ref(key).once('value').then((snapshot)=>snapshot.val());
    }

    addListenerOnChanged(key, callback) {
        const ref = firebase.database().ref(key);
        ref.on('child_changed', (data) => {
            callback(data.val());
        });
    }
}

const firebaseService = new FirebaseService();
export default firebaseService;
