import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store"
import { router } from 'expo-router'
import { MetadataQuery, ProfileMetadata, useMetadataQuery } from '@/lens-protocol/graphql/generated'
import { handleToProfileMetadata } from '@/lens-protocol/functions/handleToProfileMetadata'
import { Skeleton } from 'moti/skeleton'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EditProfileModal from '@/components/editProfileModal'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

export default function Profile() {
    const [profileMetadata, setProfileMetada] = useState<null | MetadataQuery>();
    const [editProfileModal, setEditProfileModal] = useState<boolean>(false);
    
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('identity_token');
        await SecureStore.deleteItemAsync('selectedHandle');
        router.push('/');
    };

    const handleFetchData = async () => {
        const handle = await SecureStore.getItemAsync('selectedHandle');
        if (!handle) {
            router.push('/selectProfileModal');
            return;
        };
        const data = await handleToProfileMetadata({
            forHandle: handle
        });
        if (data?.profile?.metadata === null) {
            setEditProfileModal(true);
        }
        setProfileMetada(data)
    
    }
    useEffect(()=>{
        handleFetchData();
    },[])
 if (profileMetadata) return (
    <SafeAreaView>
        <ScrollView>
            <View className=' '>
                <View className=' flex flex-row justify-between m-3'>
                    <Text className=' text-xl font-semibold'>
                        {profileMetadata?.profile?.handle?.localName}
                    </Text>
                    <TouchableOpacity>
                        <Entypo name="new-message" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View className=' mx-4 mt-2  flex flex-row items-center justify-between'>
                    <View>
                        {
                        profileMetadata?.profile?.metadata?.coverPicture 
                        ? 
                        <Image src={profileMetadata.profile.metadata.coverPicture?.optimized?.uri}/> :
                        <FontAwesome name="user-circle-o" size={84} color="gray" />                        }
                        <View>

                        </View>
                    </View>
                    <View className=' flex flex-row gap-10 items-center justify-center mr-16'>
                        {/* <View className=' flex items-center'>
                            <Text className=' text-xl font-semibold'>0</Text>
                            <Text >Posts</Text>
                        </View> */}
                        <View className=' flex items-center'>
                            <Text className=' text-xl font-semibold'>0</Text>
                            <Text className=' ' >Following</Text>
                        </View>                        
                        <View className=' flex items-center'>
                            <Text className=' text-xl font-semibold'>0</Text>
                            <Text className=' ' >Followers</Text>
                        </View>
                    </View>
                </View>
                <View className=' mx-4'>
                    <View>
                        {/* Bio and Display Name */}
                    </View>
                    <TouchableOpacity onPress={()=>{setEditProfileModal(true)}} className=' bg-gray-300 rounded mt-5 '>
                        <Text className=' text-center  p-2 font-semibold'>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className=' flex flex-row mt-6'>
                    <TouchableOpacity className=' flex items-center w-1/2'>
                        <MaterialIcons name="grid-on" size={24} color={"black"} />
                        <View className={` w-full border border-black mt-4`}></View>
                    </TouchableOpacity>
                    <TouchableOpacity className=' flex items-center w-1/2'>
                        <AntDesign name="retweet" size={24} color={"gray"} />
                        <View className={`w-full border border-gray-200 mt-4`}></View>
                    </TouchableOpacity>
                </View>


                <TouchableOpacity onPress={()=>{setEditProfileModal(true)}}>
                    <Text>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} className='' >
                   <Text>Log Out</Text>
                </TouchableOpacity>
            </View>
            { profileMetadata && <EditProfileModal data={profileMetadata} isOpen={editProfileModal} setOpen={(value: boolean)=>{setEditProfileModal(value)}}/>}

        </ScrollView>
    </SafeAreaView>
  )
}