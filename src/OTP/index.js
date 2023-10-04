
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { React, useState, useRef } from 'react';
import { getApp } from 'firebase/app';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import app from '../firebaseConfig'
import { Alert } from 'react-native';
import WebView from 'react-native-webview';
const OTP = () => {
  const auth = getAuth(app);
  const recaptchaVerifier = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationID] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const firebaseConfig = app ? app.options : undefined;
  const [info, setInfo] = useState("");
  const attemptInvisibleVerification = false;

  const handleSendVerificationCode = async () => {
    try {
      console.log("kk");
      const phoneProvider = new PhoneAuthProvider(auth); 
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      ); 
      setVerificationID(verificationId);
      setInfo('Success : Verification code has been sent to your phone');
    } catch (error) {
      console.log("errorrrr");
      setInfo(`Error : ${error.message}`);
    }
  };
  const handleVerifyVerificationCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode); 
      await signInWithCredential(auth, credential); 
      setInfo('Success: Phone authentication successful'); 
      Alert.alert("done")
    } catch (error) {
      setInfo(`Error : ${error.message}`); // show the error.
    }
  }
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      {
        info && <Text style={styles.text}>{info}</Text>
      }

      { 
        !verificationId && (
          <View>
            <Text style={styles.text}>Enter the phone number</Text>

            <TextInput
              placeholder='+923057788109'
              autoFocus
              autoCompleteType='tel'
              keyboardType='phone-pad'
              textContentType='telephoneNumber'
              onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            />

            <Button
              onPress={() => handleSendVerificationCode()}
              title="Send Verification Code"
              disabled={!phoneNumber}
            />
          </View>
        )

      }

      {
        verificationId && (
          <View>
            <Text style={styles.text}>Enter the verification code</Text>

            <TextInput
              editable={!!verificationId}
              placeholder="123456"
              onChangeText={setVerificationCode}
            />

            <Button
              title="Confirm Verification Code"
              disabled={!verificationCode}
              onPress={() => handleVerifyVerificationCode()}
            />
          </View>
        )
      }

      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  )
}
const styles = StyleSheet.create({
  text: {
    color: "#aaa"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
export default OTP
