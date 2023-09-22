import { View, Text, Alert } from 'react-native'
import 'expo-dev-client'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import React, { useState, useEffect } from 'react';
// import {firestore, getDocs} from '@react-native-firebase/firestore'
import { Firestore, collection, getDoc, getDocs, getFirestore } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
const GoogleSigninExpo = () => {
  
  const navigation=useNavigation()
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [docData, setDocData] = useState({})
  useEffect(() => {
    console.log("okk");
    const firebaseConfig = {
      apiKey: 'AIzaSyCiE4sKqw8BX-g7j-lPSUvgNta0MmemRuI',
      authDomain: 'projectsigninexpo.firebaseapp.com',
      projectId: 'projectsigninexpo',
      storageBucket: 'projectsigninexpo.appspot.com',
      messagingSenderId: '889678013137',
      appId: '1:889678013137:android:003638645af4581c645bf0',
      // databaseURL: 'https://console.firebase.google.com/u/0/project/projectsigninexpo/database/projectsigninexpo-default-rtdb/data/~2F'
    };
    const app = initializeApp(firebaseConfig)
    console.log(app, "okkkkk");

    const db = getFirestore(app)
    console.log(db, "db");
    try {

      const collect = collection(db, 'email');
      getDocs(collect)
        .then((query) => {
          console.log('Total users: ', query.size);
          query.forEach((doc) => {
            console.log('User ID: '
              // , doc.id
              , doc.data());
            setDocData(doc.data())
          });
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    } catch (error) {
      console.log("get collection", error);
    }
    // if (!firestore.apps.length) {
    //   firestore.initializeApp();
    // }
    const user = auth().currentUser;

    if (user) {
      const email = user.displayName;
      console.log('User email:', email);


    } else {
      console.log('User not signed in.');
    }

  }, [])

  GoogleSignin.configure({
    webClientId: '889678013137-c6opqf0t922ca231fi0j0lf782t50qs8.apps.googleusercontent.com',
  });
  // function onAuthStateChanged(user) {
  //     setUser(user);
  //     if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
  //     return subscriber;
  // }, []);

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.navigate("GoogleLoginHome")
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("user cancel")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("operation progress", error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("play services unavailable", error)
      } else {
        console.log("other error:", error)
      }
    }
  };

  // if (initializing) return null;
  // if (!user) {
  //     return (
  //       <View>
  //         <Text>Login</Text>
  //       </View>
  //     );
  //   }
  return (
    <View>
      <GoogleSigninButton
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
      />
      <Text>{docData.email}</Text>
      <Text>{docData.rollNo}</Text>
    </View>
  )
}

export default GoogleSigninExpo