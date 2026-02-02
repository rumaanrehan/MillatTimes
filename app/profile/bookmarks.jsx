import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsCardSecondary } from '../../components/NewsCardSecondary';
import { useBookmarks } from '../../context/BookmarkContext';

export default function BookmarksScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { bookmarks } = useBookmarks();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </Pressable>
                <Text style={styles.title}>Bookmarks</Text>
            </View>

            <FlatList
                data={bookmarks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NewsCardSecondary news={item} language="en" />
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No bookmarks yet.</Text>
                        <Text style={styles.emptySubText}>Save articles to read them later.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontFamily: 'NotoSans_700Bold',
        color: '#111827',
    },
    listContent: {
        paddingBottom: 20,
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'NotoSans_400Regular',
        color: '#9ca3af',
    },
});
