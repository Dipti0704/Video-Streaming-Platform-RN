import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import Heading from '../ui/Heading'
import { cardStyles } from '@/styles/cardStyles'
import AnimeCardItem from '../cards/AnimeCardItem'
import CustomText from '../ui/CustomText'
import { useAnimeStore } from '@/service/animeStore'

const TopRated: FC<{ scrollRef: any }> = ({ scrollRef }) => {
    const handleScrollToTop = () => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    const { topRated } = useAnimeStore()
    return (
        <View style={cardStyles.container}>
            <Heading title='Top Rated' seeAll />
            <FlatList
                horizontal
                windowSize={2}
                initialNumToRender={2}
                data={topRated}
                renderItem={({ item }) => <AnimeCardItem item={item} />}
                keyExtractor={item => item._id}
                contentContainerStyle={{ marginTop: 20 }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default TopRated
