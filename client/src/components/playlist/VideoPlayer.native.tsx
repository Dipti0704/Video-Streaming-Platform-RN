import { Colors } from '@/utils/Constants';
import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av';
import { FC, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import ScalePress from '../ui/ScalePress';
import { interactionStyles } from '@/styles/interactionStyles';
import { Anime } from '@/service/animeStore';

const VideoPlayer: FC<{ item: Anime }> = ({ item }) => {
    const ref = useRef<Video>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldPlay, setShouldPlay] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
        setShouldPlay(true);
    };

    const handleStatusUpdate = (status: AVPlaybackStatusSuccess) => {
        if (!status.isLoaded) return;
        // If playback unexpectedly stops, keep the overlay shown.
        if (status.isPlaying) setIsLoaded(true);
    };
    return (
        <View style={interactionStyles.videoContainer}>

            <Video
                ref={ref}
                style={interactionStyles.video}
                source={{ uri: item?.stream_url }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={shouldPlay}
                isLooping={false}
                onLoad={handleLoad}
                onError={(e) => console.log('Video error', e)}
                onPlaybackStatusUpdate={(status) => handleStatusUpdate(status as AVPlaybackStatusSuccess)}
            />
            {!isLoaded &&
                <Image source={{ uri: item?.thumbnail_url }} style={interactionStyles.imageOverlay} />
            }
            {!isLoaded &&
                <ScalePress style={interactionStyles.playIcon} >
                    <Ionicons name="play-circle" size={RFValue(60)} color={Colors.theme} />
                </ScalePress>
            }
        </View>
    );
}



export default VideoPlayer;
