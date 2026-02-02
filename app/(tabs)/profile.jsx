import { useRouter } from "expo-router";
import {
    Bell,
    Bookmark,
    ChevronRight,
    Crown,
    Download,
    Globe,
    Info,
    Languages,
    Settings,
    UserCircle,
    Users,
    Youtube
} from 'lucide-react-native';
import { useState } from 'react';
import {
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROFILE_OPTIONS = [
    {
        title: 'Content',
        items: [
            { label: 'Bookmarks', icon: Bookmark, color: '#4b5563', route: '/profile/bookmarks' },
            { label: 'Downloads', icon: Download, color: '#4b5563', route: '/profile/downloads' },
        ]
    },
    {
        title: 'Premium',
        items: [
            { label: 'Subscribe Premium', icon: Crown, color: '#ca8a04', premium: true },
        ]
    },
    {
        title: 'App Settings',
        items: [
            { label: 'Notifications', icon: Bell, color: '#4b5563', disabled: true },
            { label: 'Settings', icon: Settings, color: '#4b5563', route: '/profile/settings' },
            { label: 'Language', icon: Languages, color: '#4b5563', route: '/profile/language' },
        ]
    },
    {
        title: 'Support & About',
        items: [
            { label: 'About App', icon: Info, color: '#4b5563', route: '/profile/about' },
            { label: 'About Us', icon: Users, color: '#4b5563', route: '/profile/about-us' },
            { label: 'Visit YouTube', icon: Youtube, color: '#ef4444', url: 'https://www.youtube.com/@MillatTimesTV' },
            { label: 'Visit Website', icon: Globe, color: '#3b82f6', url: 'https://millattimes.com/' },
        ]
    }
];

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const handlePress = (item) => {
        if (item.premium) {
            setShowPremiumModal(true);
        } else if (item.route) {
            // Use router.push() but ensure route exists
            router.push(item.route);
        } else if (item.url) {
            Linking.openURL(item.url);
        }
    };

    const handlePremiumBannerPress = () => {
        setShowPremiumModal(true);
    };

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]} >
            {/* Header Section */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <View style={styles.userInfo}>
                    <UserCircle size={80} color="#008351ff" strokeWidth={1} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        <Text style={styles.brandText}>Millat Times</Text>
                    </View>
                </View>
                <Pressable style={[styles.loginButton, styles.disabledButton]} disabled={true}>
                    <Text style={[styles.loginButtonText, styles.disabledButtonText]}>Login / Sign Up</Text>
                </Pressable>
            </View>

            {/* Premium Banner */}
            <Pressable onPress={handlePremiumBannerPress} style={styles.premiumBanner}>
                <View style={styles.premiumInfo}>
                    <Crown size={24} color="#ffffff" />
                    <View style={styles.premiumTextContainer}>
                        <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                        <Text style={styles.premiumSubtitle}>Ad-free experience & exclusive content</Text>
                    </View>
                </View>
                <ChevronRight size={20} color="#ffffff" />
            </Pressable>

            {/* Premium Coming Soon Modal */}
            <Modal
                visible={showPremiumModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPremiumModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowPremiumModal(false)}
                >
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalIconContainer}>
                            <Crown size={48} color="#ca8a04" />
                        </View>
                        <Text style={styles.modalTitle}>Premium Coming Soon</Text>
                        <Text style={styles.modalMessage}>
                            We{'\''}re working on bringing you an amazing premium experience with ad-free content and exclusive features. Stay tuned!
                        </Text>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => setShowPremiumModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Got it</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Options List */}
            {PROFILE_OPTIONS.map((section, idx) => (
                <View key={idx} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <View style={styles.sectionCard}>
                        {section.items.map((item, itemIdx) => (
                            <Pressable
                                key={itemIdx}
                                onPress={() => !item.disabled && handlePress(item)}
                                disabled={item.disabled}
                                style={[
                                    styles.optionItem,
                                    itemIdx === section.items.length - 1 && styles.noBorder,
                                    item.disabled && styles.disabledOption
                                ]}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: item.premium ? '#fef9c3' : '#f3f4f6' }]}>
                                        <item.icon size={20} color={item.disabled ? '#d1d5db' : item.color} />
                                    </View>
                                    <Text style={[styles.optionLabel, item.premium && styles.premiumLabel, item.disabled && styles.disabledLabel]}>
                                        {item.label}
                                    </Text>
                                </View>
                                <ChevronRight size={18} color={item.disabled ? '#e5e7eb' : '#9ca3af'} />
                            </Pressable>
                        ))}
                    </View>
                </View>
            ))}

            <View style={styles.footer}>
                <Text style={styles.versionText}>© 2026 Millat Times — All Rights Reserved</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
    welcomeText: {
        fontSize: 16,
        color: '#6b7280',
        fontFamily: 'NotoSans_400Regular',
    },
    brandText: {
        fontSize: 24,
        color: '#008351ff',
        fontFamily: 'NotoSans_700Bold',
    },
    loginButton: {
        backgroundColor: '#008351ff',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 30,
        shadowColor: '#008351',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'NotoSans_600SemiBold',
    },
    premiumBanner: {
        margin: 20,
        backgroundColor: '#ca8a04',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    premiumInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    premiumTextContainer: {
        gap: 2,
    },
    premiumTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'NotoSans_700Bold',
    },
    premiumSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: 'NotoSans_400Regular',
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
        fontFamily: 'NotoSans_600SemiBold',
    },
    sectionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderBottomColor: '#f3f4f6',
        borderColor: '#f3f4f6',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 16,
        color: '#1f2937',
        fontFamily: 'NotoSans_500Medium',
    },
    premiumLabel: {
        color: '#ca8a04',
        fontWeight: '600',
    },
    footer: {
        padding: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: '#9ca3af',
        fontFamily: 'NotoSans_400Regular',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    modalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fef9c3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: 'NotoSans_700Bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#6b7280',
        fontFamily: 'NotoSans_400Regular',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    modalButton: {
        backgroundColor: '#008351ff',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'NotoSans_600SemiBold',
    },
    disabledButton: {
        backgroundColor: '#f3f4f6',
        shadowOpacity: 0,
        elevation: 0,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    disabledButtonText: {
        color: '#9ca3af',
    },
    disabledOption: {
        opacity: 0.5,
    },
    disabledLabel: {
        color: '#9ca3af',
    },
});
