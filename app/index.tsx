import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

export default function Index() {

  return (
    <SafeAreaView>
        <ScrollView>
            <View className=' flex items-center justify-center h-screen'>
                <Text>
                    Welcome
                </Text>
                <TouchableOpacity onPress={()=>{router.push('/claimHandle')}} className=' m-5'>
                    <Text>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{router.push('/login')}} className=' m-5'>
                    <Text>Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}