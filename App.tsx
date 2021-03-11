import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  CastButton,
  useRemoteMediaClient,
  useStreamPosition,
} from 'react-native-google-cast';
import Video from 'react-native-video';

const VIDEO_URI =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4';

export default function App() {
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<Video | null>();
  const client = useRemoteMediaClient();
  const streamPosition = useStreamPosition();

  useEffect(() => {
    if (client) {
      client.loadMedia({
        mediaInfo: {
          contentUrl: VIDEO_URI,
        },
        startTime: videoProgress,
      });
    }
  }, [client]);

  useEffect(() => {
    if (streamPosition) {
      setVideoProgress(streamPosition);
    }
  }, [streamPosition]);

  const onProgress = (currentTime: number) => {
    setVideoProgress(currentTime);
  };

  const onPlayPause = () => {
    const newState = !isPaused;
    setIsPaused(newState);

    if (client) {
      newState ? client.pause() : client.play();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text>progress: {videoProgress}</Text>
        <CastButton style={styles.castButton} />
        <View style={styles.playerContainer}>
          <Video
            style={styles.player}
            ref={(ref) => (videoRef.current = ref)}
            source={{uri: VIDEO_URI}}
            onProgress={({currentTime}) => onProgress(currentTime)}
            paused={isPaused}
            repeat={true}
          />
        </View>
        <TouchableOpacity onPress={onPlayPause} style={styles.button}>
          <Text>Play/Pause</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  button: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  castButton: {
    width: 24,
    height: 24,
    zIndex: 999,
  },
  playerContainer: {
    position: 'relative',
    width: '100%',
    height: 211,
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
