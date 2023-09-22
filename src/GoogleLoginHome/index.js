import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
const GoogleLoginHome = () => {
    
  const navigation=useNavigation()
  return (
    <View>
      <Text>GoogleLoginHome</Text>
    </View>
  )
}

export default GoogleLoginHome