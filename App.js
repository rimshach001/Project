import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GoogleSigninExpo from './src/GoogleSigninExpo';
import AppNavigator from './src/Navigation';
import { NavigationContainer } from '@react-navigation/native';
// import Home from './src/Home';
// import Camera from './src/Camera';
// import databaseSqlite from './src/databaseSqlite';
export default function App() {
  return (
    <NavigationContainer>

      <AppNavigator/>
    </NavigationContainer>
    
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

{/* <databaseSqlite/> */}
{/* <Camera/> */}
{/* <GoogleSigninExpo/> */}