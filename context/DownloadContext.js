import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DownloadContext = createContext();

const DOWNLOAD_DIR = `${FileSystem.documentDirectory}downloads/`;

export const DownloadProvider = ({ children }) => {
    const insets = useSafeAreaInsets();
    const [downloads, setDownloads] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: 'Saved', icon: 'checkmark-circle' });
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const triggerToast = (message = 'Saved', icon = 'checkmark-circle') => {
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

    useEffect(() => {
        ensureDirExists();
        loadDownloads();
    }, []);

    const ensureDirExists = async () => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
            }
        } catch (error) {
            console.error('Failed to ensure download directory exists:', error);
        }
    };

    const loadDownloads = async () => {
        try {
            const storedDownloads = await AsyncStorage.getItem('downloads');
            if (storedDownloads) {
                setDownloads(JSON.parse(storedDownloads));
            }
        } catch (error) {
            console.error('Failed to load downloads:', error);
        }
    };

    const articleDownloaded = (id) => {
        return downloads.some((article) => article.id === id);
    };

    const toggleDownload = async (article) => {
        try {
            let newDownloads;
            const isDownloaded = articleDownloaded(article.id);

            if (isDownloaded) {
                // Remove download
                const articleToRemove = downloads.find(item => item.id === article.id);
                if (articleToRemove && articleToRemove.localImage) {
                    try {
                        await FileSystem.deleteAsync(articleToRemove.localImage, { idempotent: true });
                    } catch (err) {
                        console.error('Failed to delete local image:', err);
                    }
                }
                newDownloads = downloads.filter((item) => item.id !== article.id);
                triggerToast('Deleted', 'trash-outline');
            } else {
                // Add download
                let localImage = null;
                if (article.image) {
                    const filename = article.image.split('/').pop().split('?')[0] || `${article.id}.jpg`;
                    const fileUri = `${DOWNLOAD_DIR}${article.id}_${filename}`;

                    try {
                        const downloadResumable = FileSystem.createDownloadResumable(
                            article.image,
                            fileUri,
                            {}
                        );

                        const { uri } = await downloadResumable.downloadAsync();
                        localImage = uri;
                        triggerToast();
                    } catch (err) {
                        console.error('Image download failed:', err);
                    }
                }

                const articleWithLocalImage = {
                    ...article,
                    localImage,
                    originalImage: article.image,
                    // Use local URI for the image property if available
                    image: localImage || article.image
                };

                newDownloads = [...downloads, articleWithLocalImage];
            }

            setDownloads(newDownloads);
            await AsyncStorage.setItem('downloads', JSON.stringify(newDownloads));
        } catch (error) {
            console.error('Failed to toggle download:', error);
        }
    };

    const removeDownload = async (id) => {
        try {
            const articleToRemove = downloads.find(item => item.id === id);
            if (articleToRemove && articleToRemove.localImage) {
                try {
                    await FileSystem.deleteAsync(articleToRemove.localImage, { idempotent: true });
                } catch (err) {
                    console.error('Failed to delete local image:', err);
                }
            }
            const newDownloads = downloads.filter((item) => item.id !== id);
            setDownloads(newDownloads);
            await AsyncStorage.setItem('downloads', JSON.stringify(newDownloads));
            triggerToast('Deleted', 'trash-outline');
        } catch (error) {
            console.error('Failed to remove download:', error);
        }
    };

    const clearAllDownloads = async () => {
        try {
            // Delete the entire directory and its contents
            await FileSystem.deleteAsync(DOWNLOAD_DIR, { idempotent: true });
            // Re-create the empty directory
            await ensureDirExists();

            // Clear state and storage
            setDownloads([]);
            await AsyncStorage.removeItem('downloads');
            triggerToast('All Deleted', 'trash-outline');
        } catch (error) {
            console.error('Failed to clear all downloads:', error);
        }
    };

    return (
        <DownloadContext.Provider
            value={{
                downloads,
                articleDownloaded,
                toggleDownload,
                removeDownload,
                clearAllDownloads,
            }}
        >
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
        </DownloadContext.Provider>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#1f2937', // Dark gray
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

export const useDownloads = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownloads must be used within a DownloadProvider');
    }
    return context;
};
