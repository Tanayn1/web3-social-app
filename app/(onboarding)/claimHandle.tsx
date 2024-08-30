import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '@/components/input'
import { HandleToAddressQuery, useHandleToAddressQuery } from '@/lens-protocol/graphql/generated';
import { ApolloError } from '@apollo/client';
import { createProfileLensProtocol } from '@/utils/handleCreateProfile';
import { router } from 'expo-router';

export default function claimHandle() {
  const [handle, setHandle] = useState<null | string>(null);
  const [validHandle, setValidHandle]= useState<null | string>(null); 
  const [creationLoading, setCreationLoading] = useState<boolean>(false);
  const { loading, error, data } = useHandleToAddressQuery({
    variables: {
      request: {
        handle: `lens/${handle}`
      }
    }
  });


const createProfileWithHandle = async ()=>{
  setCreationLoading(true)
  if (!validHandle) {
    setCreationLoading(false)
    return
  }
  await createProfileLensProtocol(validHandle);
  router.push('/home');
  setCreationLoading(false);
}

  return (
    <SafeAreaView>
      <ScrollView>
        <View className=' flex items-center justify-center h-screen'>
          <Text className=' text-xl font-semibold'>Welcome To Bandz</Text>
          <Text className=' text-center'>Time to create your profile on the lens protocol, all your data is owned by you and you only</Text>
          <View className=' border border-gray-200 flex  flex-row rounded-xl w-[340px] h-[50px]'>
            <View className=' bg-zinc-200 rounded-l-xl h-[50px] flex justify-center items-center w-[60px] '>
              <Text className=' text-gray-600'>
                @Lens/
              </Text>
            </View>
            <TextInput value={handle ?? ''} onChangeText={(text)=>{setHandle(text.toLocaleLowerCase())}}  className=' w-[280px] p-3'/>
          </View>
          <ErrorMessage setData={(handle: string)=>{setValidHandle(handle)}} value={handle} loading={loading} error={error} data={data}/>
          <View className=' mt-8'>
            <TouchableOpacity disabled={creationLoading} onPress={createProfileWithHandle} className=' bg-black rounded-xl w-[340px] '>
              <Text className=' text-white p-4 text-center'>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
interface errorMessage {
  loading: boolean,
  error: ApolloError | undefined
  data: HandleToAddressQuery | undefined
  value: null | string
  setData: Function
}

const ErrorMessage = ({loading, error, data, value, setData} : errorMessage) => {
  if (value === null) {
    return null
  }

  if (value === '') {
      return (
        <View>
          <Text>invalid format</Text>
        </View>
    )
  }

  if (data?.handleToAddress === null) {
    setData(value);
      return (
        <View>
          <Text>This Handle is availible</Text>
        </View>
    )
  }

  if (data?.handleToAddress) {
      return (
        <View>
          <Text>This Handle is in use</Text>
        </View>
    )
  }

  
}