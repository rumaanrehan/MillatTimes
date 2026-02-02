import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
    Bell,
    ChevronRight,
    Database,
    Download,
    Languages,
    Moon,
    Smartphone,
    Trash2,
    Wifi
} from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDownloads } from '../../context/DownloadContext';

const SETTINGS_SECTIONS = [
    {
        title: 'Preferences',
        items: [
            {
                label: 'Language',
                icon: Languages,
                color: '#4b5563',
                type: 'navigation',
                route: '/profile/language',
                subtitle: 'English'
            },
            {
                label: 'Theme',
                icon: Moon,
                color: '#4b5563',
                type: 'navigation',
                subtitle: 'Light',
                disabled: true
            },
        ]
    },
    {
        title: 'Notifications',
        items: [
            {
                label: 'Push Notifications',
                icon: Bell,
                color: '#4b5563',
                type: 'toggle',
                key: 'pushNotifications',
                disabled: true
            },
            {
                label: 'Breaking News Alerts',
                icon: Smartphone,
                color: '#4b5563',
                type: 'toggle',
                key: 'breakingNewsAlerts',
                disabled: true
            },
        ]
    },
    {
        title: 'Data & Storage',
        items: [
            {
                label: 'Download Quality',
                icon: Download,
                color: '#4b5563',
                type: 'navigation',
                subtitle: 'High',
                disabled: true
            },
            {
                label: 'Data Saver Mode',
                icon: Wifi,
                color: '#4b5563',
                type: 'toggle',
                key: 'dataSaverMode',
                disabled: true
            },
            {
                label: 'Storage Usage',
                icon: Database,
                color: '#4b5563',
                type: 'navigation',
                subtitle: 'View details',
                disabled: true
            },
        ]
    },
    {
        title: 'Cache & Data',
        items: [
            {
                label: 'Clear Cache',
                icon: Trash2,
                color: '#ef4444',
                type: 'action',
                action: 'clearCache'
            },
            {
                label: 'Delete All Downloads',
                icon: Download,
                color: '#ef4444',
                type: 'action',
                action: 'clearDownloads'
            },
        ]
    },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { clearAllDownloads } = useDownloads();
    const insets = useSafeAreaInsets();
    const [toggleStates, setToggleStates] = useState({
        pushNotifications: false,
        breakingNewsAlerts: false,
        dataSaverMode: false,
    });

    const handleToggle = (key) => {
        setToggleStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleClearCache = async () => {
        Alert.alert(
            "Clear Cache",
            "Are you sure you want to clear all cached data?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert("Success", "Cache cleared successfully.");
                        } catch (_e) {
                            Alert.alert("Error", "Failed to clear cache.");
                        }
                    }
                }
            ]
        );
    };

    const handleClearDownloads = async () => {
        Alert.alert(
            "Delete All Downloads",
            "Are you sure you want to remove all saved articles from your device?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await clearAllDownloads();
                            Alert.alert("Success", "All downloads have been deleted.");
                        } catch (_e) {
                            Alert.alert("Error", "Failed to clear downloads.");
                        }
                    }
                }
            ]
        );
    };

    const handleItemPress = (item) => {
        if (item.disabled) return;

        if (item.type === 'navigation' && item.route) {
            router.push(item.route);
        } else if (item.type === 'action') {
            if (item.action === 'clearCache') {
                handleClearCache();
            } else if (item.action === 'clearDownloads') {
                handleClearDownloads();
            }
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </Pressable>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {SETTINGS_SECTIONS.map((section, idx) => (
                    <View key={idx} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionCard}>
                            {section.items.map((item, itemIdx) => (
                                <Pressable
                                    key={itemIdx}
                                    onPress={() => handleItemPress(item)}
                                    disabled={item.disabled && item.type !== 'toggle'}
                                    style={[
                                        styles.settingItem,
                                        itemIdx === section.items.length - 1 && styles.noBorder,
                                        item.disabled && styles.disabledItem
                                    ]}
                                >
                                    <View style={styles.settingLeft}>
                                        <View style={[
                                            styles.iconContainer,
                                            { backgroundColor: item.color === '#ef4444' ? '#fee2e2' : '#f3f4f6' }
                                        ]}>
                                            <item.icon
                                                size={20}
                                                color={item.disabled ? '#d1d5db' : item.color}
                                            />
                                        </View>
                                        <View style={styles.settingTextContainer}>
                                            <Text style={[
                                                styles.settingLabel,
                                                item.disabled && styles.disabledText
                                            ]}>
                                                {item.label}
                                            </Text>
                                            {item.subtitle && (
                                                <Text style={styles.settingSubtitle}>
                                                    {item.subtitle}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {item.type === 'toggle' ? (
                                        <Switch
                                            value={toggleStates[item.key]}
                                            onValueChange={() => handleToggle(item.key)}
                                            trackColor={{ false: '#d1d5db', true: '#86efac' }}
                                            thumbColor={toggleStates[item.key] ? '#008351ff' : '#f3f4f6'}
                                            disabled={item.disabled}
                                        />
                                    ) : (
                                        <ChevronRight
                                            size={18}
                                            color={item.disabled ? '#e5e7eb' : '#9ca3af'}
                                        />
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Info Text */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Some settings are currently under development and will be available in future updates.
                    </Text>
                </View>
            </ScrollView>
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
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        gap: 16,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'NotoSans_700Bold',
        color: '#1f2937',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#6b7280',
        fontFamily: 'NotoSans_600SemiBold',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    settingItem: {
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
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingTextContainer: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: '#1f2937',
        fontFamily: 'NotoSans_500Medium',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#9ca3af',
        fontFamily: 'NotoSans_400Regular',
        marginTop: 2,
    },
    disabledItem: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#9ca3af',
    },
    infoContainer: {
        marginTop: 8,
        paddingHorizontal: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#9ca3af',
        fontFamily: 'NotoSans_400Regular',
        textAlign: 'center',
        lineHeight: 18,
    },
});
