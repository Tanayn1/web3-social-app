import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { signIn } from '@/lens-protocol/functions/login'
import { Wallet } from 'ethers'

export default function login() {
    const handleLogin = async () => {
        const wallet = new Wallet("50bf32df8314a397f68de47ae7a5e785abac36183965769250a77c643af1be93");
        await signIn(wallet);
        router.push('/home')
    }
  return (
    <SafeAreaView>
        <ScrollView>
            <View className=' flex justify-center items-center h-screen'>
                <TouchableOpacity onPress={handleLogin} className=''>
                    <Text>Connect Wallet</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}