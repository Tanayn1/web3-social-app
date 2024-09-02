import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SecureStore from "expo-secure-store"
import { handleToProfileMetadata } from '@/lens-protocol/functions/handleToProfileMetadata'
import { router } from 'expo-router';
import { MetadataQuery } from '@/lens-protocol/graphql/generated';
import Input from "../../components/input"

export default function editProfile() {
  const [existingProfileMetadata, setExistingProfileMetadata] = useState<null | MetadataQuery>();
  const [profilePicUri, setProfilePicUri] = useState<null | string>();
  const [displayName, setDispayName] = useState<null | string>();
  const [bio, setBio] = useState<null | string>();

  const handleFetchData = async () => {
    const handle = await SecureStore.getItemAsync('selectedHandle');
    if (!handle) {
        router.push('/selectProfileModal');
        return;
    };
    const data = await handleToProfileMetadata({
        forHandle: handle
    });
    setExistingProfileMetadata(data);
  }

  useEffect(()=>{
    handleFetchData();
  },[]);

    return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View className=' flex items-center'>
            <EditProfilePic/>
          </View>
          <View className=' flex gap-1 mx-7 mt-10'>
            <View>
                <Text className=' text-sm font-semibold text-zinc-600 mb-2'>Display Name</Text>
                <Input className=' w-full'  value={displayName ?? ''} onChangeText={(text)=>{setDispayName}}/>
            </View>
            <View>
                <Text className=' text-sm text-zinc-600 font-semibold mb-2'>Bio</Text>
                <Input className=' h-[100px]' value={bio ?? ''} onChangeText={(text)=>{setBio(text)}} multiline={true} numberOfLines={10}/>
            </View>
          </View>
          <TouchableOpacity>
            <Text>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


const EditProfilePic = () => {
  return (
    <View className='relative'>
      <View className=' w-[94px] h-[94px] rounded-xl'>
        <FontAwesome name="user-circle-o" size={94} color="gray" />
        <View className='absolute bottom-0 right-0 bg-blue-500 rounded-full w-[30px] h-[30px] items-center justify-center'>
          <Text className='text-white text-xl'>+</Text>
        </View>
      </View>
    </View>
  )
}