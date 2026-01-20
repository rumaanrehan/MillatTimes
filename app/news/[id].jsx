import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppText from '../../components/AppText';
import { newsData } from '../../data/news-data';

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Find the news article by id
    const article = newsData.find(item => item.id === id);

    // Get related news (same category, excluding current article)
    const relatedNews = newsData
        .filter(item => item.category === article?.category && item.id !== id)
        .slice(0, 3);

    if (!article) {
        return (
            <View style={styles.errorContainer}>
                <AppText size={18} weight="600">Article not found</AppText>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AppText size={16} weight="500" style={styles.backButtonText}>Go Back</AppText>
                </Pressable>
            </View>
        );
    }

    const handleBookmarkPress = () => {
        setIsBookmarked(!isBookmarked);
    }
    return (
        <View style={styles.container}>
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
                    <Pressable style={styles.headerButton}>
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
                    <Text style={styles.metaText}>{article.source}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.metaText}>{article.time}</Text>
                </View>

                {/* Featured Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                {/* Description */}
                <Text style={styles.description}>{article.description}</Text>

                {/* Main Content */}
                <Text style={styles.content}>{article.content}</Text>

                {/* Additional Content Paragraphs (simulated) */}
                <Text style={styles.content}>
                    This development has significant implications for the industry and beyond. Experts suggest that the impact will be felt across multiple sectors, potentially reshaping how we approach similar challenges in the future.
                </Text>

                <Text style={styles.content}>
                    Stakeholders from various fields have expressed both enthusiasm and caution regarding these developments. While the potential benefits are substantial, there are also important considerations regarding implementation and long-term effects that need to be carefully evaluated.
                </Text>

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
                    <Pressable style={styles.actionButton}>
                        <Ionicons name="share-social-outline" size={22} color="#4b5563" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </Pressable>
                </View>

                {/* Related News Section */}
                {relatedNews.length > 0 && (
                    <View style={styles.relatedSection}>
                        <Text style={styles.relatedTitle}>Related News</Text>
                        {relatedNews.map((item) => (
                            <Pressable
                                key={item.id}
                                style={styles.relatedCard}
                                onPress={() => router.push(`/news/${item.id}`)}
                            >
                                <View style={styles.relatedImageContainer}>
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' }}
                                        style={styles.relatedImage}
                                    />
                                </View>
                                <View style={styles.relatedContent}>
                                    <Text style={styles.relatedCategory}>{item.category}</Text>
                                    <Text style={styles.relatedHeadline} numberOfLines={2}>
                                        {item.headline}
                                    </Text>
                                    <Text style={styles.relatedTime}>{item.time}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
        backgroundColor: '#d60f0f',
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
        backgroundColor: '#fef2f2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginHorizontal: 16,
        marginTop: 20,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#d60f0f',
        textTransform: 'uppercase',
    },
    headline: {
        fontSize: 28,
        fontFamily: 'NotoSans_700Bold',
        color: '#0a0a0a',
        lineHeight: 36,
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
    description: {
        fontSize: 18,
        fontFamily: 'NotoSerif_500Medium',
        color: '#374151',
        lineHeight: 28,
        marginHorizontal: 16,
        marginTop: 20,
    },
    content: {
        fontSize: 16,
        fontFamily: 'NotoSerif_400Regular',
        color: '#4b5563',
        lineHeight: 26,
        marginHorizontal: 16,
        marginTop: 16,
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
    relatedSection: {
        marginTop: 40,
        paddingTop: 24,
        borderTopWidth: 8,
        borderTopColor: '#f3f4f6',
    },
    relatedTitle: {
        fontSize: 22,
        fontFamily: 'NotoSans_700Bold',
        color: '#0a0a0a',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    relatedCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        gap: 12,
    },
    relatedImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
    },
    relatedImage: {
        width: '100%',
        height: '100%',
    },
    relatedContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    relatedCategory: {
        fontSize: 11,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#9ca3af',
        textTransform: 'uppercase',
    },
    relatedHeadline: {
        fontSize: 15,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#0a0a0a',
        lineHeight: 20,
    },
    relatedTime: {
        fontSize: 12,
        fontFamily: 'NotoSerif_400Regular',
        color: '#9ca3af',
    },
});
