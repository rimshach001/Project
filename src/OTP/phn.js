
// import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
// import { React, useState, useRef } from 'react';
// import { getApp } from 'firebase/app';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
// import app from '../firebaseConfig'
// import { Alert } from 'react-native';
// const OTP = () => {
//   const auth = getAuth(app);
//   const recaptchaVerifier = useRef(null);

//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationId, setVerificationID] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');

//   const firebaseConfig = app ? app.options : undefined;
//   const [info, setInfo] = useState("");
//   const attemptInvisibleVerification = false;

//   const handleSendVerificationCode = async () => {
//     try {
//       console.log("kk");
//       const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
//       const verificationId = await phoneProvider.verifyPhoneNumber(
//         phoneNumber,
//         recaptchaVerifier.current
//       ); // get the verification id
//       setVerificationID(verificationId);
//       setInfo('Success : Verification code has been sent to your phone');
//     } catch (error) {
//       console.log("errorrrr");
//       setInfo(`Error : ${error.message}`);
//     }
//   };
//   const handleVerifyVerificationCode = async () => {
//     try {
//       const credential = PhoneAuthProvider.credential(verificationId, verificationCode); // get the credential
//       await signInWithCredential(auth, credential); // verify the credential
//       setInfo('Success: Phone authentication successful'); // if OK, set the message
//       // navigation.navigate("Welcome"); // navigate to the welcome screen
//       Alert.alert("done")
//     } catch (error) {
//       setInfo(`Error : ${error.message}`); // show the error.
//     }
//   }
//   return (
//     <View style={styles.container}>
//       <FirebaseRecaptchaVerifierModal
//         ref={recaptchaVerifier}
//         firebaseConfig={firebaseConfig}
//       />

//       {
//         info && <Text style={styles.text}>{info}</Text>
//       }

//       { // show the phone number input field when verification id is not set.
//         !verificationId && (
//           <View>
//             <Text style={styles.text}>Enter the phone number</Text>

//             <TextInput
//               placeholder='+923057788109'
//               autoFocus
//               autoCompleteType='tel'
//               keyboardType='phone-pad'
//               textContentType='telephoneNumber'
//               onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
//             />

//             <Button
//               onPress={() => handleSendVerificationCode()}
//               title="Send Verification Code"
//               disabled={!phoneNumber}
//             />
//           </View>
//         )

//       }

//       { // if verification id exists show the confirm code input field.
//         verificationId && (
//           <View>
//             <Text style={styles.text}>Enter the verification code</Text>

//             <TextInput
//               editable={!!verificationId}
//               placeholder="123456"
//               onChangeText={setVerificationCode}
//             />

//             <Button
//               title="Confirm Verification Code"
//               disabled={!verificationCode}
//               onPress={() => handleVerifyVerificationCode()}
//             />
//           </View>
//         )
//       }

//       {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//   text: {
//     color: "#aaa"
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }
// })
// export default OTP






// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { getAuth, signInWithPhoneNumber ,PhoneAuthProvider} from '@react-native-firebase/auth'; // If using Firebase for OTP
// import auth from '@react-native-firebase/auth'
// const OTP = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [verificationId, setVerificationId] = useState('');
//   const handleSendVerificationCode = async () => {
//     try {
//       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber);
//       setVerificationId(confirmationResult.verificationId);
//       Alert.alert('Verification code sent.');
//     } catch (error) {
//       console.log('Error sending verification code:', error.message);
//     }
//   };
  
//   const handleVerifyVerificationCode = async () => {
//     try {
//       const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
//       await auth().signInWithCredential(credential); // Use auth() here
//       Alert.alert('OTP verified successfully.');
//     } catch (error) {
//       Alert.alert('Error verifying OTP:', error.message);
//     }
//   };
  
  

//   return (
//     <View style={{paddingTop:100}}>
//       <Text>Enter your phone number:</Text>
//       <TextInput
//         placeholder="Phone number"
//         onChangeText={setPhoneNumber}
//       />
//       <Button title="Send OTP" onPress={handleSendVerificationCode} />

//       <Text>Enter the OTP:</Text>
//       <TextInput
//         placeholder="OTP"
//         onChangeText={setVerificationCode}
//       />
//       <Button title="Verify OTP" onPress={handleVerifyVerificationCode} />
//     </View>
//   );
// };

// export default OTP;



// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider } from '@react-native-firebase/auth';

// const OTP = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [verificationId, setVerificationId] = useState('');
//   const auth = getAuth();

//   const handleSendVerificationCode = async () => {
//     try {
//       // Create a RecaptchaVerifier instance if needed
//       const recaptchaVerifier = new RecaptchaVerifier(
//         'recaptcha-container', // Specify a ref to an invisible reCAPTCHA element if you're using reCAPTCHA
//         {
//           size: 'invisible',
//           callback: (response) => {
//             // reCAPTCHA solved, continue with sign-in
//           },
//         }
//       );

//       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
//       setVerificationId(confirmationResult.verificationId);
//       Alert.alert('Verification code sent.');
//     } catch (error) {
//       console.log('Error sending verification code:', error.message);
//     }
//   };

//   const handleVerifyVerificationCode = async () => {
//     try {
//       const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
//       await auth.signInWithCredential(credential);
//       Alert.alert('OTP verified successfully.');
//     } catch (error) {
//       Alert.alert('Error verifying OTP:', error.message);
//     }
//   };

//   return (
//     <View style={{ paddingTop: 100 }}>
//       <Text>Enter your phone number:</Text>
//       <TextInput
//         placeholder="Phone number"
//         onChangeText={setPhoneNumber}
//       />
//       <Button title="Send OTP" onPress={handleSendVerificationCode} />

//       <Text>Enter the OTP:</Text>
//       <TextInput
//         placeholder="OTP"
//         onChangeText={setVerificationCode}
//       />
//       <Button title="Verify OTP" onPress={handleVerifyVerificationCode} />
//     </View>
//   );
// };

// export default OTP;
