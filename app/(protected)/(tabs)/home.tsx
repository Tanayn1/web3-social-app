import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function home() {
  return (
    <SafeAreaView>
        <ScrollView>
            <View className=' flex items-center'>
                <Text>
                    Home
                </Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}