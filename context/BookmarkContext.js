import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
    const insets = useSafeAreaInsets();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: 'Bookmarked', icon: 'bookmark' });
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const triggerToast = (message = 'Bookmarked', icon = 'bookmark') => {
        setToastConfig({ message, icon });
        setShowToast(true);
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setShowToast(false);
        });
    };

    // Load bookmarks on mount
    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = async () => {
        try {
            const storedBookmarks = await AsyncStorage.getItem('bookmarks');
            if (storedBookmarks) {
                setBookmarks(JSON.parse(storedBookmarks));
            }
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBookmark = async (post) => {
        try {
            let updatedBookmarks;
            const isBookmarked = bookmarks.some((b) => b.id === post.id);

            if (isBookmarked) {
                updatedBookmarks = bookmarks.filter((b) => b.id !== post.id);
                triggerToast('Removed', 'bookmark-outline');
            } else {
                updatedBookmarks = [...bookmarks, post];
                triggerToast('Bookmarked', 'bookmark');
            }

            setBookmarks(updatedBookmarks);
            await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        }
    };

    const isBookmarked = (postId) => {
        return bookmarks.some((b) => b.id === postId);
    };

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, loading }}>
            {children}
            {showToast && (
                <Animated.View
                    style={[
                        styles.toastContainer,
                        {
                            bottom: insets.bottom + 100,
                            opacity: fadeAnim,
                            transform: [{
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Ionicons name={toastConfig.icon} size={20} color="#ffffff" />
                    <Text style={styles.toastText}>{toastConfig.message}</Text>
                </Animated.View>
            )}
        </BookmarkContext.Provider>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#1f2937',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 9999,
    },
    toastText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'NotoSans_600SemiBold',
    },
});

export function useBookmarks() {
    return useContext(BookmarkContext);
}
