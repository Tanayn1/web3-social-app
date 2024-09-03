import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { signIn } from '@/lens-protocol/functions/login'
import { Wallet } from 'ethers'
import SelectHandleModal from '@/components/selectHandleModal'

export default function login() {
    const [showHandlesModal, setShowHandlesModal] = useState<boolean>(false);
    // const handleLogin = async () => {
    //     const wallet = new Wallet("50bf32df8314a397f68de47ae7a5e785abac36183965769250a77c643af1be93");
    //     await signIn(wallet);
    //     router.push('/home')
    // }
    
  return (
    <SafeAreaView>
        <ScrollView>
            <View className=' flex justify-center items-center h-screen'>
                <TouchableOpacity onPress={()=>{setShowHandlesModal(true)}} className=''>
                    <Text>log in</Text>
                </TouchableOpacity>
            </View>
            <SelectHandleModal isOpen={showHandlesModal} setOpen={(value: boolean)=>{setShowHandlesModal(value)}}/>
        </ScrollView>
    </SafeAreaView>
  )
}