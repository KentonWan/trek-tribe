import * as firebase from'firebase';
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyAbDl883Igfl5yHIde--8aGPeLVop4MJ-w",
    authDomain: "trek-tribe-d15ae.firebaseapp.com",
    databaseURL: "https://trek-tribe-d15ae.firebaseio.com",
    projectId: "trek-tribe-d15ae",
    storageBucket: "trek-tribe-d15ae.appspot.com",
    messagingSenderId: "944488526175"
  };

  if(!firebase.apps.length){
      firebase.initializeApp(config);
  }

  const db = firebase.database();
  const auth = firebase.auth();

  export {
      db,
      auth,
  };