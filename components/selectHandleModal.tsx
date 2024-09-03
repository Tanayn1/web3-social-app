import { View, Text, Touchable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { useOwnedHandlesQuery } from '@/lens-protocol/graphql/generated'
import { handleToProfileId } from '@/lens-protocol/functions/handleToProfileId'
import { signInProfileId } from '@/lens-protocol/functions/login'
import { Wallet } from 'ethers'
import { router } from 'expo-router'
import * as SecureStorage from 'expo-secure-store'


interface SelectHandleModal {
    isOpen: boolean,
    setOpen: Function

}

export default function SelectHandleModal({ isOpen, setOpen, ...rest }: SelectHandleModal) {    
    const { data, error, loading } = useOwnedHandlesQuery({
        variables: {
          request: {
            for: "0x6C4b91558861C143919cA947fF93F2E38d2C328f"
          }
        }
      });
      

      const handleSelction = async (handle : string) => {
        try {
            const wallet = new Wallet('50bf32df8314a397f68de47ae7a5e785abac36183965769250a77c643af1be93')
            const profileId = await handleToProfileId(handle);
            await SecureStorage.setItemAsync('selected_handle', handle);
            await SecureStorage.setItemAsync('profile_id', `${profileId}`);
            await signInProfileId(wallet, profileId);
            setOpen(false);
            router.push('/home')
        } catch (error) {
            console.log(error)
        }  
      }

  return (
    <Modal 
    visible={isOpen}
    animationType='fade'
    transparent
    statusBarTranslucent
    {...rest}
    >
        <TouchableWithoutFeedback onPress={()=>{setOpen(false)}}>
            <View className=' flex-1 items-center justify-center bg-zinc-900/40 '>
                <TouchableWithoutFeedback>
                    <View className=' bg-white'>
                        <Text>Select One Of You Handles</Text>
                        {data?.ownedHandles.items.length !== 0 || data !== null ? data?.ownedHandles.items.map((handle, index)=>{
                            return (
                                <View key={index}>
                                    <TouchableOpacity onPress={()=>{handleSelction(handle.fullHandle)}}>
                                        <Text>{handle.fullHandle}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}) : 
                            <View>
                                <Text>You have No Handles</Text>
                                <TouchableOpacity>
                                    <Text>Buy one</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  )
}