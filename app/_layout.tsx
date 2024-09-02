import 'react-native-get-random-values'
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router, Stack } from 'expo-router'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import * as SecureStore from "expo-secure-store"
const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_BACKEND_URL,
  cache: new InMemoryCache()
});

export default function App() {
  const checkAuthenticated = async () => {
    const accessToken = await SecureStore.getItemAsync('access_token');
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (accessToken || refreshToken) {
      router.push('/home')
    }
  }

  useEffect(()=>{
    checkAuthenticated();
  },[])
  return (
    <ApolloProvider client={client}>
      <RootLayout/>
    </ApolloProvider>
  )
}

export const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      {/* <Stack.Screen name='(tabs)' options={{headerShown: false}}/> */}
      <Stack.Screen name='(protected)' options={{headerShown: false}}/>
      <Stack.Screen name='(onboarding)' options={{headerShown: false}}/>
      <Stack.Screen name='(auth)' options={{headerShown: false}}/>
    </Stack>
  )
}