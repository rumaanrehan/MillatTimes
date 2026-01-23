import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryNavbar } from "../../components/Navbar";
import { NewsCard } from "../../components/NewsCard";
import { NewsCardSecondary } from "../../components/NewsCardSecondary";
import { SecondaryNavbar } from "../../components/SecondaryNavbar";
import { usePosts } from "../../hooks/usePosts";

function HomeContent() {
    const router = useRouter();
    const [language, setLanguage] = useState('en');
    const [selectedTab, setSelectedTab] = useState({ key: 'millat_times', categoryId: null });
    const insets = useSafeAreaInsets();

    const {
        posts,
        loading,
        refreshing,
        error,
        refresh,
        loadMore,
        hasMore
    } = usePosts(10, selectedTab.categoryId);


    const renderFooter = () => {
        if (!loading || refreshing) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#008351ff" />
            </View>
        );
    };

    if (error && posts.length === 0) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <Text style={styles.errorText}>{error}</Text>
                <Text onPress={refresh} style={styles.retryText}>Retry</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <>
                <PrimaryNavbar
                    language={language}
                    onMenuClick={() => { }}
                    onLogoClick={() => router.push('/')}
                />
                <SecondaryNavbar
                    onTabChange={setSelectedTab}
                    language={language}
                />
            </>
            {loading && posts.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#008351ff" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={({ item, index }) => {
                        // For now, let's make every 4th item a secondary card for variety
                        if (index % 4 === 1) {
                            return (
                                <NewsCardSecondary
                                    news={item}
                                    language={language}
                                />
                            );
                        }
                        return (
                            <NewsCard
                                news={item}
                                language={language}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    scrollEnabled={true}
                    contentContainerStyle={styles.listContent}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refresh}
                            colors={["#008351ff"]}
                        />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.center}>
                                <Text style={styles.emptyText}>No news found.</Text>
                            </View>
                        )
                    }
                />
            )}
        </View>
    );
}

export default function Home() {
    return (
        <HomeContent />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },
    listContent: { paddingBottom: 20 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        fontFamily: 'NotoSans_600SemiBold',
        marginBottom: 10,
    },
    retryText: {
        color: '#008351ff',
        fontSize: 16,
        fontFamily: 'NotoSans_700Bold',
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 16,
        fontFamily: 'NotoSans_500Medium',
    }
});
