import * as firebase from "firebase";

class FirebaseService {
    constructor() {
		const config = {
		  apiKey: "<API_KEY>",
		  authDomain: "<PROJECT_ID>.firebaseapp.com",
		  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
		  storageBucket: "<BUCKET>.appspot.com",
		};
		firebase.initializeApp(config);

		firebase.auth().signInAnonymously().catch(function(error) {
		  // Handle Errors here.
		  const errorCode = error.code;
		  const errorMessage = error.message;
		  // ...
		});
    }
}

const firebaseService = new FirebaseService();
export default firebaseService;