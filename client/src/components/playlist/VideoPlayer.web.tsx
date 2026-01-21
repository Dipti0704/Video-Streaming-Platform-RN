import { Colors } from '@/utils/Constants';
import { FC, useRef, useState, useEffect, createElement } from 'react';
import { View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import ScalePress from '../ui/ScalePress';
import { interactionStyles } from '@/styles/interactionStyles';
import { Anime } from '@/service/animeStore';
import Hls from 'hls.js';

const VideoPlayer: FC<{ item: Anime }> = ({ item }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !item?.stream_url) return;

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(item.stream_url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                 // specific logic when manifest is parsed if needed
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                   console.error("HLS Fatal Error", data);
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = item.stream_url;
        } else {
            console.error("HLS is not supported in this browser.");
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [item?.stream_url]);

    const handleReadyForPlay = () => {
        // We can use a timeout to simulate "loading" UI or just set specific events
        // But for HLS, we usually wait for canplay
        setTimeout(() => {
             setIsLoaded(true)
             setIsPaused(false)
             if (videoRef.current) {
                 videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
             }
        }, 3000)
    }

    return (
        <View style={interactionStyles.videoContainer}>
            {createElement('video', {
                ref: videoRef,
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    objectFit: 'contain'
                },
                controls: true,
                onCanPlay: () => {
                    if (!isLoaded) {
                         handleReadyForPlay();
                    }
                }
            })}

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
