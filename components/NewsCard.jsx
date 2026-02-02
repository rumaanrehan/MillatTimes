import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';
import { useDownloads } from '../context/DownloadContext';

export function NewsCard({ news, language }) {
  const router = useRouter();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { articleDownloaded, toggleDownload } = useDownloads();
  const bookmarked = isBookmarked(news.id);
  const downloaded = articleDownloaded(news.id);
  const isRTL = language === 'ur';
  const styles = getStyles(isRTL);

  const handlePress = () => {
    router.push(`/news/${news.id}`);
  };

  const handleBookmarkPress = () => {
    toggleBookmark(news);
  };

  const handleDownloadPress = () => {
    toggleDownload(news);
  };

  const handleSharePress = () => {
    Share.share({
      message: `${news.headline} ${news.link}`,
    });
  };
  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {/* Category */}
      <Text style={styles.category}>{news.category}</Text>

      {/* Headline */}
      <Text
        style={styles.headline}
        numberOfLines={3}
      >
        {news.headline}
      </Text>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: news.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      <View style={styles.footer}>
        {/* Timestamp */}
        <Text style={styles.timestamp}>{news.time}</Text>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {/* <Pressable style={styles.actionButton}>
            <Ionicons name="chatbox-outline" size={20} color="#4b5563" />
          </Pressable> */}
          <Pressable style={styles.actionButton} onPress={handleBookmarkPress}>
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={bookmarked ? "#ffd500ff" : "#4b5563"}
            />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleDownloadPress}>
            <Ionicons
              name={downloaded ? "download" : "download-outline"}
              size={20}
              color={downloaded ? "#008351ff" : "#4b5563"}
            />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleSharePress}>
            <Ionicons name="share-social-outline" size={20} color="#4b5563" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function getStyles(isRTL) {
  return StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderBottomColor: '#c4c2c2ff',
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    category: {
      fontSize: 12,
      fontFamily: 'NotoSans_600SemiBold',
      color: '#9ca3af',
      marginBottom: 12,
      textTransform: 'uppercase',
      textAlign: isRTL ? 'right' : 'left',
    },
    headline: {
      fontSize: 20,
      fontFamily: 'NotoSans_700Bold',
      color: '#0a0a0a',
      marginBottom: 16,
      lineHeight: 28,
      textAlign: isRTL ? 'right' : 'left',
    },
    imageContainer: {
      height: 224,
      marginBottom: 16,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#e5e7eb',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    footer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timestamp: {
      fontSize: 14,
      fontFamily: 'NotoSerif_400Regular',
      color: '#9ca3af',
      textAlign: isRTL ? 'right' : 'left',
    },
    actionsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 30,
      justifyContent: 'space-evenly',
      paddingHorizontal: 20,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
