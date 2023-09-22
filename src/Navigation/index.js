// Navigation.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GoogleLoginHome from '../GoogleLoginHome';
import GoogleSigninExpo from '../GoogleSigninExpo';


const Stack = createStackNavigator();

function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen name="Signin" component={GoogleSigninExpo} />
        <Stack.Screen name="GoogleLoginHome" component={GoogleLoginHome} />
      </Stack.Navigator>
  );
}

export default AppNavigator;
