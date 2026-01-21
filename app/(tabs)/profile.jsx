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
import {
    Linking,
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
            { label: 'Bookmarks', icon: Bookmark, color: '#4b5563' },
            { label: 'Downloads', icon: Download, color: '#4b5563' },
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
            { label: 'Notifications', icon: Bell, color: '#4b5563' },
            { label: 'Settings', icon: Settings, color: '#4b5563' },
            { label: 'Language', icon: Languages, color: '#4b5563' },
        ]
    },
    {
        title: 'Support & About',
        items: [
            { label: 'About App', icon: Info, color: '#4b5563' },
            { label: 'About Us', icon: Users, color: '#4b5563' },
            { label: 'Visit YouTube', icon: Youtube, color: '#ef4444', url: 'https://www.youtube.com/@MillatTimesTV' },
            { label: 'Visit Website', icon: Globe, color: '#3b82f6', url: 'https://millattimes.com/' },
        ]
    }
];

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();

    const handlePress = (item) => {
        if (item.url) {
            Linking.openURL(item.url);
        }
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
                <Pressable style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Login / Sign Up</Text>
                </Pressable>
            </View>

            {/* Premium Banner */}
            <View style={styles.premiumBanner}>
                <View style={styles.premiumInfo}>
                    <Crown size={24} color="#ffffff" />
                    <View style={styles.premiumTextContainer}>
                        <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                        <Text style={styles.premiumSubtitle}>Ad-free experience & exclusive content</Text>
                    </View>
                </View>
                <ChevronRight size={20} color="#ffffff" />
            </View>

            {/* Options List */}
            {PROFILE_OPTIONS.map((section, idx) => (
                <View key={idx} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <View style={styles.sectionCard}>
                        {section.items.map((item, itemIdx) => (
                            <Pressable
                                key={itemIdx}
                                onPress={() => handlePress(item)}
                                style={[
                                    styles.optionItem,
                                    itemIdx === section.items.length - 1 && styles.noBorder
                                ]}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: item.premium ? '#fef9c3' : '#f3f4f6' }]}>
                                        <item.icon size={20} color={item.color} />
                                    </View>
                                    <Text style={[styles.optionLabel, item.premium && styles.premiumLabel]}>
                                        {item.label}
                                    </Text>
                                </View>
                                <ChevronRight size={18} color="#9ca3af" />
                            </Pressable>
                        ))}
                    </View>
                </View>
            ))}

            <View style={styles.footer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
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
});
