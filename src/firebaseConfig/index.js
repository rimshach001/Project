import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { firebase } from "@react-native-firebase/auth";

const firebaseConfig = {
    apiKey: 'AIzaSyCiE4sKqw8BX-g7j-lPSUvgNta0MmemRuI',
    authDomain: 'projectsigninexpo.firebaseapp.com',
    projectId: 'projectsigninexpo',
    storageBucket: 'projectsigninexpo.appspot.com',
    messagingSenderId: '889678013137',
    appId: '1:889678013137:android:003638645af4581c645bf0',
    // databaseURL: 'https://console.firebase.google.com/u/0/project/projectsigninexpo/database/projectsigninexpo-default-rtdb/data/~2F'
  };
  export const app = initializeApp(firebaseConfig)
  console.log(app, "okkkkk");

  export const db = getFirestore(app)
  console.log(db, "db");