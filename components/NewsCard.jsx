import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Share } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
export function NewsCard({ news, language }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isRTL = language === 'ur';
  const styles = getStyles(isRTL);

  const handlePress = () => {
    router.push(`/news/${news.id}`);
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSharePress = () => {
    Share.share({
      message: news.headline,
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
          source={{ uri: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80' }}
          style={styles.image}
        />
      </View>

      {/* Timestamp */}
      <Text style={styles.timestamp}>{news.time}</Text>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton}>
          <Ionicons name="chatbox-outline" size={20} color="#4b5563" />
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleBookmarkPress}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isBookmarked ? "#ffd500ff" : "#4b5563"}
          />
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleSharePress}>
          <Ionicons name="share-social-outline" size={20} color="#4b5563" />
        </Pressable>
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
    timestamp: {
      fontSize: 14,
      fontFamily: 'NotoSerif_400Regular',
      color: '#9ca3af',
      marginBottom: 16,
      textAlign: isRTL ? 'right' : 'left',
    },
    actionsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
      paddingTop: 16,
    },
    actionButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
    },
  });
}
