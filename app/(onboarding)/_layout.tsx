import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store';


export default function onboarding_layout() {
  const checkAuthenticated = async () => {
    const accessToken = await SecureStore.getItemAsync('access_token');
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (accessToken || refreshToken) {
      router.push('/home')
    }
  }
  useEffect(()=>{
    checkAuthenticated(); 
  })
  return (
    <Stack >
        <Stack.Screen name='claimHandle' options={{headerShown: false}} />
    </Stack>
  )
}