import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export function NewsCardSecondary({ news, language }) {
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

    return (
        <Pressable onPress={handlePress} style={styles.container}>
            <View style={styles.contentContainer}>
                {/* Left column: Text info */}
                <View style={styles.textContainer}>
                    <Text style={styles.category}>{news.category}</Text>
                    <Text style={styles.headline} numberOfLines={3}>
                        {news.headline}
                    </Text>
                    <Text style={styles.timestamp}>{news.time}</Text>
                </View>

                {/* Right column: Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' }}
                        style={styles.image}
                    />
                </View>
            </View>

            {/* Actions (Bottom) */}
            <View style={styles.actionsContainer}>
                <View style={styles.leftActions}>
                    <Pressable style={styles.actionButton}>
                        <Ionicons name="chatbox-outline" size={18} color="#4b5563" />
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleBookmarkPress}>
                        <Ionicons
                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                            size={18}
                            color={isBookmarked ? "#ffd500ff" : "#4b5563"}
                        />
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
            marginTop: 12,
        },
        leftActions: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 16,
        },
        actionButton: {
            padding: 4,
        },
    });
}
