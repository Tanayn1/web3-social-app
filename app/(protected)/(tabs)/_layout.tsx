import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import * as SecureStore from "expo-secure-store"

export default function TabLayout() {
  const check = async () => {
    const handle = await SecureStore.getItemAsync('selectedHandle');
    if (!handle) {
      router.push('/selectProfileModal')
    }
  }
  useEffect(()=>{
    check();
  },[])
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home', 
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile'
        }}
      />
  </Tabs>
  );
}
