import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SecureStore from "expo-secure-store"
import { handleToProfileMetadata } from '@/lens-protocol/functions/handleToProfileMetadata'
import { router } from 'expo-router';
import { MetadataQuery } from '@/lens-protocol/graphql/generated';
import Input from "./input"
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from "expo-image-picker"
import * as Crypto from "expo-crypto"
import { uploadJson } from '@/lens-protocol/functions/uploadJson';

interface EditProfile {
    isOpen: boolean,
    setOpen: Function,
    data: MetadataQuery
}

export default function EditProfileModal({ isOpen, setOpen, data, ...rest }: EditProfile) {
  const [existingProfileMetadata, setExistingProfileMetadata] = useState<null | MetadataQuery>();
  const [profilePicUri, setProfilePicUri] = useState<null | string>();
  const [displayName, setDispayName] = useState<null | string>();
  const [bio, setBio] = useState<null | string>();

  const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0Nzg0Mzk3MC1jY2Y3LTQ1ZjEtODAwMy0wMmExYzc5MGQ3MmYiLCJlbWFpbCI6InRhbmF5dG9uZGFyZUBob3RtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3ZDE2OTg0YzRhYzE5OTYzNmUwZSIsInNjb3BlZEtleVNlY3JldCI6ImQ1Y2IzYzE2ODY3YjE3ZTkxNTg4NDU0YWRkN2Q0MzdiNDRjZDAwMTY1MWNjN2QyZWQzNzcxM2Q3ZWE4MGVlZWQiLCJleHAiOjE3NTY3OTI3MjN9.SuhgKWLe02bqBTFGEd_iD7JM4g5XJfW47HyKxPAXe7g'


  const uploadImageFromGallery = async () => {
    try {
       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
       console.log("image permssion status",status);
       if (status !== 'granted') {
        alert('You must allow access to gallary');
        return
       }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        }); 
        if (!result.canceled) {
            setProfilePicUri(result.assets[0].uri);
            uploadFileToPinataIFPS(result);
        }
    } catch (error) {
        console.log(error)
    }
  }

  const pinMetaDataToPinataIFPSandSet = async (name : string | null, bio: string | null, picture: string | null, profileId : string ) => {
    try {
        const body = JSON.stringify({
            pinataContent: {
                $schema: "https://json-schemas.lens.dev/profile/2.0.0.json",
                lens: {
                    id: Crypto.randomUUID(),
                    name: name,
                    bio: bio,
                    picture: picture,
                    coverPicture: picture,
                    attributes: []
                }
            },
            pinataMetadata: {
                profileId: profileId
            }
        });

        const options = {
            method: 'POST',
            headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
            body: body
          };

        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options);
        const data = await response.json();
        console.log("metadata response", data)
        const metadataURI = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        const setMetadataResponse = await uploadJson({
            metadataURI
        });

        


        
    } catch (error) {
        console.log(error)
    }
  }

  const uploadFileToPinataIFPS = async (image: ImagePicker.ImagePickerSuccessResult ) => {
    try {
        const formData = new FormData();
        //@ts-ignore
        formData.append('file', {
            uri: image.assets[0].uri,
            type: image.assets[0].type,
            name: image.assets[0].fileName
        });
        console.log(process.env.EXPO_PUBLIC_PINATA_JWT_SECRET)

        const options = {
            method: 'POST',
            headers: {Authorization: `Bearer ${JWT}`, 'Content-Type': 'multipart/form-data'},
            body: formData
          };
        
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options);
        const data = await response.json();
        console.log("upload image to ifps pinata",data);
        const hostedUri = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        //setProfilePicUri(hostedUri);

    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmit = () => {

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
            <View className=' bg-white rounded-xl w-[400px] h-[450px]'>
                <View className=' flex items-center mt-10'>
                    <TouchableOpacity onPress={uploadImageFromGallery} className='relative'>
                        <View className=' w-[94px] h-[94px] rounded-xl'>
                            {profilePicUri ?  <Image source={{ uri: profilePicUri }} className=' rounded-full' height={100} width={100}/>  : <FontAwesome name="user-circle-o" size={94} color="gray" />}
                            <View className='absolute bottom-0 right-0 bg-blue-500 rounded-full w-[30px] h-[30px] items-center justify-center'>
                                <Entypo name="camera" size={14} color="white" />        
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className=' flex  mx-7 mt-3'>
                    <View>
                        <Text className=' text-sm font-semibold text-zinc-600 mb-2'>Display Name</Text>
                        <Input className=' w-full'  value={displayName ?? ''} onChangeText={(text)=>{setDispayName}}/>
                    </View>
                    <View>
                        <Text className=' text-sm text-zinc-600 font-semibold mb-2'>Bio</Text>
                        <Input className=' h-[100px]' value={bio ?? ''} onChangeText={(text)=>{setBio(text)}} multiline={true} numberOfLines={10}/>
                    </View>
                </View>
                <TouchableOpacity className=' bg-black items-center mx-7 rounded-xl'>
                    <Text className=' text-md font-semibold text-white p-3'>
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
 
  )
}


const EditProfilePic = () => {
  return (
    <TouchableOpacity  className='relative'>
      <View className=' w-[94px] h-[94px] rounded-xl'>
        <FontAwesome name="user-circle-o" size={94} color="gray" />
        <View className='absolute bottom-0 right-0 bg-blue-500 rounded-full w-[30px] h-[30px] items-center justify-center'>
            <Entypo name="camera" size={14} color="white" />        
        </View>
      </View>
    </TouchableOpacity>
  )
}