import { Youtube } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { PrimaryNavbar } from '../../components/Navbar';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@MillatTimesTV';

export default function VideosScreen() {
    const insets = useSafeAreaInsets();
    const [language] = useState('en');

    const handleOpenChannel = async () => {
        const supported = await Linking.canOpenURL(YOUTUBE_CHANNEL_URL);
        if (supported) {
            Linking.openURL(YOUTUBE_CHANNEL_URL);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <PrimaryNavbar
                language={language}
                onMenuClick={() => {}}
                onLogoClick={() => {}}
            />
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* <View style={styles.header}>
                    <AppText size={28} weight="700" style={styles.title}>Videos</AppText>
                    <AppText size={16} weight="400" style={styles.subtitle}>
                        Watch our latest videos on YouTube
                    </AppText>
                </View> */}

                <Pressable 
                    onPress={handleOpenChannel}
                    style={styles.channelCard}
                    android_ripple={{ color: '#e5e7eb' }}
                >
                    <View style={styles.channelIconContainer}>
                        <Youtube size={48} color="#ef4444" />
                    </View>
                    <View style={styles.channelContent}>
                        <AppText size={22} weight="700" style={styles.channelTitle}>
                            Millat Times TV
                        </AppText>
                        <AppText size={16} weight="400" style={styles.channelDescription}>
                            Visit our YouTube channel to watch all our videos, news updates, and exclusive content.
                        </AppText>
                        <View style={styles.actionButton}>
                            <Youtube size={20} color="#ffffff" />
                            <AppText size={16} weight="600" style={styles.actionButtonText}>
                                Open YouTube Channel
                            </AppText>
                        </View>
                    </View>
                </Pressable>

                {/* <View style={styles.footer}>
                    <AppText size={14} weight="400" style={styles.footerText}>
                        More videos coming soon
                    </AppText>
                </View> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        color: '#0a0a0a',
        marginBottom: 4,
    },
    subtitle: {
        color: '#6b7280',
    },
    channelCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginHorizontal: 20,
        marginTop: 8,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    channelIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    channelContent: {
        width: '100%',
        alignItems: 'center',
    },
    channelTitle: {
        color: '#0a0a0a',
        marginBottom: 12,
        textAlign: 'center',
    },
    channelDescription: {
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ef4444',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        gap: 8,
        width: '100%',
    },
    actionButtonText: {
        color: '#ffffff',
    },
    footer: {
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 16,
    },
    footerText: {
        color: '#9ca3af',
    },
});
