import { View, Text, Alert, StyleSheet, Button } from 'react-native'
import 'expo-dev-client'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth ,{firebase} from '@react-native-firebase/auth';
// import firebase from '../..    /config.js'
// import { initializeAsync } from 'expo-facebook';
import * as Facebook from 'expo-facebook';
import { AccessToken,LoginManager } from 'react-native-fbsdk-next';
import { signInWithCredential, FacebookAuthProvider, getAuth } from '@firebase/auth';
// import * as Facebook from 'expo-facebook';
import { app } from '../firebaseConfig';
const GoogleSigninExpo = () => {
  const [initializing, setInitializing]=useState(true)
  const [user,setUser]=useState()
  const navigation = useNavigation()
  GoogleSignin.configure({
    webClientId: '889678013137-c6opqf0t922ca231fi0j0lf782t50qs8.apps.googleusercontent.com',
  });
  // useEffect(() => {
  //   async function initializeFacebook() {
  //     try{
  //      await Facebook.initializeAsync({ appId: '300745649319266' ,appName:'Project'});
  //     }
  //     catch(e){
  //       console.log(e,"erorrrr");
  //     }
  //   }
  //   initializeFacebook();
  // }, []);
  function onAuthStateChanged(user) {
    setUser(user);
    if(initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
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

  const onFacebookButtonPress=async()=> {
    // Attempt login with permissions
    // try{

      await LoginManager.logInWithPermissions(['public_profile']);
      const data = await AccessToken.getCurrentAccessToken();
      if(!data){
        return;
      }
    const auth=getAuth(app)
    // Create a Firebase credential with the AccessToken
    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
    const user=await signInWithCredential(auth,facebookCredential)
    console.log(user,"user fb");
    
  }
  if(initializing)return null;
  // if(!user){
  //   return(
  //     <View style={{marginTop:200}}>
  //       <Button
  //       title="          Facebook Sign-In            " 
  //       onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
  //       />
  //     </View>
  //   )
  // }
  return (

    <View style={styles.container}>
      <Text style={{ fontSize: 40, color: 'black', marginBottom: 50 }}>Welcome Home</Text>
      <GoogleSigninButton 
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
      {/* <Button
        title="          Facebook Sign-In            " 
        onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
        /> */}
    </View>
  )
}

export default GoogleSigninExpo
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CBCBCC',
    flex: 1
  }
});

    // function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }
    
    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    //     return subscriber;
    // }, []);