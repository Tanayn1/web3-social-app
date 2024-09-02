import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import { refresh } from '@/lens-protocol/functions/authentication';

export default function protected_layout() {
    const checkAuthenticated = async () => {
        const accessToken = await SecureStore.getItemAsync('access_token');
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!accessToken || !refreshToken) {
          router.push('/')
        }
      }
    const refreshTokens = async () => {
        const oldAccessToken = await SecureStore.getItemAsync('access_token');
        const oldRefreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!oldAccessToken || !oldRefreshToken) {
            router.push('/');
            return
          }

        const {  accessToken, refreshToken, identityToken } =  await refresh({refreshToken: oldRefreshToken});
        await SecureStore.setItemAsync('access_token', accessToken);
        await SecureStore.setItemAsync('refresh_token', refreshToken);
        await SecureStore.setItemAsync('identity_token', identityToken);

        //console.log("Tokens Refreshed", accessToken, refreshToken, identityToken);



    }
      useEffect(()=>{
        //checkAuthenticated();
        refreshTokens();
      },[]);

      useEffect(()=>{
        const intervalId = setInterval(() => {
            refreshTokens();
          }, 25 * 60 * 1000); 
      },[])

  return (
    <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
        <Stack.Screen name='selectProfileModal' options={{headerShown: false, presentation: 'modal'}}/>
        <Stack.Screen name='editProfile' options={{headerShown: false, presentation: 'modal'}}/>

    </Stack>
  )
}