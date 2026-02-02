import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';
import { useDownloads } from '../context/DownloadContext';

export function NewsCardSecondary({ news, language }) {
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
            <View style={styles.contentContainer}>
                {/* Left column: Text info */}
                <View style={styles.textContainer}>
                    <Text style={styles.category}>{news.category}</Text>
                    <Text style={styles.headline} numberOfLines={3}>
                        {news.headline}
                    </Text>
                </View>

                {/* Right column: Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: news.image }}
                        style={styles.image}
                        contentFit="cover"
                        transition={200}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.timestamp}>{news.time}</Text>
                {/* Actions (Bottom) */}
                <View style={styles.actionsContainer}>
                    <View style={styles.leftActions}>
                        <Pressable style={styles.actionButton} onPress={handleBookmarkPress}>
                            <Ionicons
                                name={bookmarked ? "bookmark" : "bookmark-outline"}
                                size={18}
                                color={bookmarked ? "#ffd500ff" : "#4b5563"}
                            />
                        </Pressable>
                        <Pressable style={styles.actionButton} onPress={handleDownloadPress}>
                            <Ionicons
                                name={downloaded ? "download" : "download-outline"}
                                size={18}
                                color={downloaded ? "#008351ff" : "#4b5563"}
                            />
                        </Pressable>
                        <Pressable style={styles.actionButton} onPress={handleSharePress}>
                            <Ionicons name="share-social-outline" size={20} color="#4b5563" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

function getStyles(isRTL) {
    return StyleSheet.create({
        container: {
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: '#ffffff',
        },
        contentContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 12,
        },
        textContainer: {
            flex: 1,
            justifyContent: 'flex-start',
        },
        category: {
            fontSize: 11,
            fontFamily: 'NotoSans_600SemiBold',
            color: '#d60f0f',
            marginBottom: 4,
            textTransform: 'uppercase',
            textAlign: isRTL ? 'right' : 'left',
        },
        headline: {
            fontSize: 16,
            fontFamily: 'NotoSans_700Bold',
            color: '#1f2937',
            marginBottom: 8,
            lineHeight: 22,
            textAlign: isRTL ? 'right' : 'left',
        },
        footer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
        },
        timestamp: {
            fontSize: 12,
            fontFamily: 'NotoSerif_400Regular',
            color: '#9ca3af',
            textAlign: isRTL ? 'right' : 'left',
        },
        imageContainer: {
            width: 88,
            height: 88,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: '#f3f4f6',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        actionsContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
        },
        leftActions: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 16,
        },
        actionButton: {
            paddingHorizontal: 4,
        },
    });
}
