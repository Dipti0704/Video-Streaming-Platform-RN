import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { commonStyles } from '@/styles/commonStyles'
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { homeStyles } from '@/styles/homeStyles'
import HomeHeader from '@/components/home/HomeHeader'
import Featured from '@/components/home/Featured'
import { useAnimeStore } from '@/service/animeStore'
import TopLiked from '@/components/home/TopLiked'
import MostStarred from '@/components/home/MostStarred'
import TopRated from '@/components/home/TopRated'
import { Colors } from '@/utils/Constants'

const Page = () => {
  const { fetchAnimeData, live, topLiked, topRated, topStarred } = useAnimeStore()
  const [loading, setLoading] = useState(true)

  const scrollY = useSharedValue(0)
  const scrollRef = useRef<any>(null)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })


  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 120], [0, 1], 'clamp')
    return {
      opacity,
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAnimeData()
        setLoading(false)
      } catch (error) {
        console.error('Error fetching anime data:', error)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={[commonStyles.containerBlack, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.theme} />
      </View>
    )
  }

  // Show error state if no data
  if (!live?.length && !topLiked?.length && !topRated?.length && !topStarred?.length) {
    return (
      <View style={[commonStyles.containerBlack, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.theme, fontSize: 16 }}>Failed to load content</Text>
      </View>
    )
  }

  return (
    <View style={commonStyles.containerBlack}>
      <Animated.View style={homeStyles.animatedHeader}>
        <Animated.View style={[homeStyles.glassmorphismContainer, animatedHeaderStyle]}>
          <Image source={require('@/assets/icons/thumb2.png')} style={homeStyles.glassmorphismBackground} />
        </Animated.View>
        <HomeHeader />
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Featured />
        <TopLiked />
        <MostStarred />
        <TopRated scrollRef={scrollRef} />

      </Animated.ScrollView>


    </View>
  )
}

export default Page