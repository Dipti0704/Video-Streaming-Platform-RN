import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWS } from '@/service/sockets/WSProvider'
import { commonStyles } from '@/styles/commonStyles'
import AnimatedImage from '@/components/auth/AnimatedImage'
import AnimatedOverlay from '@/components/auth/AnimatedOverlay'
import { handleTouch, startMainAnimation } from '@/components/auth/animations'
import AnimatedButton from '@/components/auth/AnimatedButton'
import { Colors } from '@/utils/Constants'

const Page = () => {

  const [isButtonVisible, setButtonVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateAccessToken } = useWS()

  useEffect(() => {
    setTimeout(() => {
      startMainAnimation(setButtonVisible)
    }, 1000)
  }, [])


  return (
    <View style={commonStyles.container}>
      <AnimatedImage />
      <AnimatedOverlay />
      {
        isButtonVisible && (
          <TouchableOpacity 
            onPress={() => {
              console.log('Google button pressed')
              setIsLoading(true)
              handleTouch(updateAccessToken)
            }} 
            style={commonStyles.center}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.theme} />
            ) : (
              <AnimatedButton />
            )}
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export default Page