import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MetadataQuery, OwnedHandlesQuery, useOwnedHandlesQuery } from '@/lens-protocol/graphql/generated';
import { handleToProfileMetadata } from '@/lens-protocol/functions/handleToProfileMetadata';
import * as SecureStore from "expo-secure-store";
import { router } from 'expo-router';
import { handleToProfileId } from '@/lens-protocol/functions/handleToProfileId';
import { FontAwesome } from '@expo/vector-icons';

interface HandlesArray {
  handle: string,
  profile: MetadataQuery | undefined
}

export default function selectProfileModal() {
  const [handles, setHandles] = useState<null | string[]>(null);

  const { data, error, loading } = useOwnedHandlesQuery({
    variables: {
      request: {
        for: "0x6C4b91558861C143919cA947fF93F2E38d2C328f"
      }
    }
  });

  // const onHandleQuery = async (data: OwnedHandlesQuery | undefined) => {
  //   const handles: HandlesArray[] = [];
  //   data?.ownedHandles.items.forEach(async (handle)=>{
  //     console.log(handle.fullHandle)
  //     const data = await handleToProfileMetadata({
  //       forHandle: handle.fullHandle
  //     });
  //     console.log(data)
  //     handles.push({
  //       handle: handle.fullHandle,
  //       profile: data
  //     });

  //   });
  //   setHandles(handles);
  // }

  const handleSelection = async (handle: string) => {
    await SecureStore.setItemAsync('selectedHandle', handle);
    const data = await handleToProfileMetadata({
      forHandle: handle
    })
    const profileId = data?.profile?.id;
    console.log(profileId);
    await SecureStore.setItemAsync('profileId', profileId);
    router.push('/home');

  }


  useEffect(()=>{
    const h : string[] = []
    data?.ownedHandles.items.forEach((element)=>{
      h.push(element.fullHandle)
    })
    setHandles(h);
  },[data, error, loading]);


  return (
    <SafeAreaView>
        <ScrollView>
            {loading ? 
              <View className=' flex justify-center items-center h-screen'>
                  <Text>Loading</Text>
              </View> :
              <View>
                <Text className=' m-5 text-center text-2xl font-medium'>Select One Of <Text className=' text-green-500 text-3xl font-bold'>YOUR</Text> profiles</Text>
                <Text className=' text-center text-xs text-zinc-500'>All your profiles are owned by you and can be traded and resold</Text>
                {handles?.map((handle, index)=>{
                  return (
                      <View key={index} className=' m-4'>
                        <TouchableOpacity onPress={()=>{handleSelection(handle)}}>
                          <Text className=' text-lg '>@{handle}</Text>
                        </TouchableOpacity>
                      </View>
                  )
                })}
              </View>
            }
        </ScrollView>
    </SafeAreaView>
  )
}


