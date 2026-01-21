import { View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWS } from '@/service/sockets/WSProvider'
import { commonStyles } from '@/styles/commonStyles'
import AnimatedImage from '@/components/auth/AnimatedImage'
import AnimatedOverlay from '@/components/auth/AnimatedOverlay'
import { startMainAnimation } from '@/components/auth/animations'
import { Colors } from '@/utils/Constants'
import { login } from '@/service/api/authService'
import { useRouter } from 'expo-router'

const Page = () => {

  const [isButtonVisible, setButtonVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { updateAccessToken } = useWS()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      startMainAnimation(setButtonVisible)
    }, 1000)
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password")
      return
    }

    setIsLoading(true);
    try {
      // DUMMY AUTHENTICATION SIMULATION
      setTimeout(async () => {
        const success = await login({ idToken: "mock-google-token" }, updateAccessToken);
        if (success) {
            router.replace('/')
        } else {
            Alert.alert("Login Failed", "Mock server login failed")
        }
        setIsLoading(false);
      }, 1500); 
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to login");
    }
  }

  return (
    <View style={commonStyles.container}>
      <AnimatedImage />
      <AnimatedOverlay />
      {
        isButtonVisible && (
          <View style={[commonStyles.center, { width: '100%', paddingHorizontal: 40, gap: 20 }]}>
             <View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Enter any email & password to login</Text>
             </View>

            <TextInput 
              placeholder="Email" 
              placeholderTextColor="#ccc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#ccc"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity 
              onPress={handleLogin} 
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: 'Bold',
    color: 'white',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Regular',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    color: 'white',
    fontFamily: 'Regular',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.theme,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Bold',
    fontSize: 16
  }
})

export default Page
