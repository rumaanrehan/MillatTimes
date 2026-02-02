import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsCardSecondary } from '../../components/NewsCardSecondary';
import { useDownloads } from '../../context/DownloadContext';

export default function DownloadsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { downloads, clearAllDownloads } = useDownloads();

    const handleClearAll = () => {
        Alert.alert(
            "Delete All Downloads",
            "Are you sure you want to remove all saved articles from your device?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: clearAllDownloads
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1f2937" />
                    </Pressable>
                    <Text style={styles.title}>Downloads</Text>
                </View>
                {downloads.length > 0 && (
                    <Pressable onPress={handleClearAll} style={styles.clearButton}>
                        <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    </Pressable>
                )}
            </View>

            {downloads.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="download-outline" size={64} color="#d1d5db" />
                    <Text style={styles.emptyText}>No downloads yet</Text>
                    <Text style={styles.emptySubtext}>Articles you download will appear here for offline reading.</Text>
                    <Pressable
                        style={styles.exploreButton}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.exploreButtonText}>Explore News</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={downloads}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NewsCardSecondary news={item} language="en" />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    clearButton: {
        padding: 4,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'NotoSans_700Bold',
        color: '#1f2937',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'NotoSans_700Bold',
        color: '#374151',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'NotoSans_400Regular',
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    exploreButton: {
        marginTop: 24,
        backgroundColor: '#008351ff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    exploreButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'NotoSans_600SemiBold',
    },
});
