import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const packageJson = require('../../package.json');
    const appJson = require('../../app.json');

    const appVersion = appJson.expo.version || '1.0.0';
    const buildNumber = '1'; // Typically managed in EAS or native files
    const packageName = appJson.expo.android?.package || 'com.rumaan_r.news';
    const expoVersion = packageJson.dependencies.expo;
    const rnVersion = packageJson.dependencies['react-native'];

    const handleClearCache = async () => {
        Alert.alert(
            "Clear Cache",
            "Are you sure you want to clear all app data? This will reset your bookmarks and settings.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert("Success", "Cache cleared. Please restart the app.");
                        } catch (e) {
                            Alert.alert("Error", "Failed to clear cache.", e);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </Pressable>
                <Text style={styles.title}>About App</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionHeader}>Application Information</Text>
                <View style={styles.infoCard}>
                    <InfoRow label="App Version" value={appVersion} />
                    <InfoRow label="Build Number" value={buildNumber} />
                    {/* <InfoRow label="Package Name" value={packageName} /> */}
                    <InfoRow label="Platform" value={Platform.OS.toUpperCase()} />
                </View>

                {/* <Text style={styles.sectionHeader}>Framework Details</Text>
                <View style={styles.infoCard}>
                    <InfoRow label="Expo SDK" value={expoVersion} />
                    <InfoRow label="React Native" value={rnVersion} />
                    <InfoRow label="Router" value="Expo Router v6" />
                </View> */}

                <Text style={styles.sectionHeader}>Storage & Data</Text>
                <View style={styles.infoCard}>
                    {/* <InfoRow label="Storage Engine" value="AsyncStorage" />
                    <InfoRow label="API Endpoint" value="WP REST API v2" /> */}
                    <View style={[styles.row, { borderBottomWidth: 0 }]}>
                        <Text style={styles.label}>Local Cache</Text>
                        <Pressable onPress={handleClearCache}>
                            <Text style={styles.actionText}>Clear Data</Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.footerText}>
                    Device ID: {Constants.installationId || 'Unavailable'}
                </Text>

            </ScrollView>
        </View>
    );
}

function InfoRow({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} selectable>{value}</Text>
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
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
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
    content: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#6b7280',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 4,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    label: {
        fontSize: 16,
        fontFamily: 'NotoSans_500Medium',
        color: '#374151',
    },
    value: {
        fontSize: 15,
        fontFamily: 'NotoSans_400Regular',
        color: '#6b7280',
        maxWidth: '60%',
        textAlign: 'right',
    },
    actionText: {
        fontSize: 15,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#ef4444',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9ca3af',
        fontFamily: 'NotoSans_400Regular',
        marginTop: 32,
        marginBottom: 20,
    },
});
