import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';


export default function TabLayout() {

  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home', 
        }}
      />
  </Tabs>
  );
}
