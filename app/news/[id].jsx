import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { fetchPostById } from '../../services/wordpress';
import { transformPost } from '../../utils/wpTransform';

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const insets = useSafeAreaInsets();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchArticle() {
            try {
                setLoading(true);
                const data = await fetchPostById(id);
                setArticle(transformPost(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchArticle();
    }, [id]);

    const handleBookmarkPress = () => {
        setIsBookmarked(!isBookmarked);
    }

    const handleSharePress = async () => {
        if (article?.link) {
            Linking.openURL(article.link);
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color="#008351ff" />
            </View>
        );
    }

    if (error || !article) {
        return (
            <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
                <AppText size={18} weight="600">{error || 'Article not found'}</AppText>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AppText size={16} weight="500" style={styles.backButtonText}>Go Back</AppText>
                </Pressable>
            </View>
        );
    }

    // Simple HTML tag stripping for content until a proper renderer is added
    const cleanContent = article.content.replace(/<[^>]*>?/gm, '\n').replace(/\n\s*\n/g, '\n\n').trim();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header with back button */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#0a0a0a" />
                </Pressable>
                <View style={styles.headerActions}>
                    <Pressable style={styles.headerButton} onPress={handleBookmarkPress}>
                        <Ionicons
                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                            size={24}
                            color={isBookmarked ? "#ffd500" : "#0a0a0a"}
                        />
                    </Pressable>
                    <Pressable style={styles.headerButton} onPress={handleSharePress}>
                        <Ionicons name="share-social-outline" size={24} color="#0a0a0a" />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Category Badge */}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                </View>

                {/* Headline */}
                <Text style={styles.headline}>{article.headline}</Text>

                {/* Meta Info */}
                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>Millat Times</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.metaText}>{article.time}</Text>
                </View>

                {/* Featured Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: article.image }}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                </View>

                {/* Main Content */}
                <Text style={styles.content}>{cleanContent}</Text>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <Pressable style={styles.actionButton}>
                        <Ionicons name="chatbox-outline" size={22} color="#4b5563" />
                        <Text style={styles.actionButtonText}>Comment</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleBookmarkPress}>
                        <Ionicons
                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                            size={22}
                            color={isBookmarked ? "#ffd500" : "#0a0a0a"}
                        />
                        <Text style={styles.actionButtonText}>Save</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleSharePress}>
                        <Ionicons name="share-social-outline" size={22} color="#4b5563" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#008351ff',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#eaf9f3ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginHorizontal: 16,
        marginTop: 20,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#008351ff',
        textTransform: 'uppercase',
    },
    headline: {
        fontSize: 24,
        fontFamily: 'NotoSans_700Bold',
        color: '#0a0a0a',
        lineHeight: 32,
        marginHorizontal: 16,
        marginTop: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 12,
    },
    metaText: {
        fontSize: 14,
        fontFamily: 'NotoSerif_400Regular',
        color: '#6b7280',
    },
    metaDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#9ca3af',
        marginHorizontal: 8,
    },
    imageContainer: {
        width: '100%',
        height: 240,
        marginTop: 20,
        backgroundColor: '#e5e7eb',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        fontSize: 18,
        fontFamily: 'NotoSerif_400Regular',
        color: '#374151',
        lineHeight: 28,
        marginHorizontal: 16,
        marginTop: 24,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 16,
        marginTop: 32,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    actionButtonText: {
        fontSize: 14,
        fontFamily: 'NotoSans_500Medium',
        color: '#4b5563',
    },
});
