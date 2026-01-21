import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Anime } from '@/service/animeStore'
import { commonStyles } from '@/styles/commonStyles'
import PlaylistHeader from '@/components/playlist/PlaylistHeader'
import VideoPlayer from '@/components/playlist/VideoPlayer'
import Interactions from '@/components/playlist/Interactions'
import { Colors } from '@/utils/Constants'

const Page = () => {
    const item = useLocalSearchParams() as unknown as Anime
    console.log("PLAYLIST PARAMS:", item);

    if (!item || !item._id) {
        return (
            <View style={[commonStyles.containerBlack, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.theme} />
            </View>
        )
    }

    return (
        <View style={commonStyles.containerBlack}>
            <PlaylistHeader title={item.title} genre={item.genre} />
            <VideoPlayer item={item} />
            <Interactions item={item} />
        </View>
    )
}

export default Page