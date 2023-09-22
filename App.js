import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GoogleSigninExpo from './src/GoogleSigninExpo';
// import Home from './src/Home';
// import Camera from './src/Camera';
// import databaseSqlite from './src/databaseSqlite';
export default function App() {
  return (
    <View style={styles.container}>
      {/* <databaseSqlite/> */}
     {/* <Camera/> */}
<GoogleSigninExpo/>
    </View>
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
