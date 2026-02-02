import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const selectedLanguage = 'en'; // Default language (feature coming soon)

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </Pressable>
                <Text style={styles.title}>Language</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.description}>
                    Select your preferred language for the app
                </Text>

                {/* Coming Soon Banner */}
                <View style={styles.comingSoonBanner}>
                    <Ionicons name="information-circle" size={24} color="#008351ff" />
                    <Text style={styles.comingSoonText}>
                        Soon bringing news in your favourite language!
                    </Text>
                </View>

                {/* Language Options */}
                <View style={styles.languageList}>
                    {LANGUAGES.map((language) => (
                        <View
                            key={language.code}
                            style={[
                                styles.languageItem,
                                styles.disabledLanguageItem,
                                selectedLanguage === language.code && styles.selectedLanguageItem
                            ]}
                        >
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, styles.disabledText]}>{language.name}</Text>
                                <Text style={[styles.languageNativeName, styles.disabledText]}>{language.nativeName}</Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                styles.disabledRadioButton,
                                selectedLanguage === language.code && styles.radioButtonSelected
                            ]}>
                                {selectedLanguage === language.code && (
                                    <Check size={16} color="#d1d5db" strokeWidth={3} />
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Save Button - Disabled */}
                <View style={[styles.saveButton, styles.disabledButton]}>
                    <Text style={[styles.saveButtonText, styles.disabledButtonText]}>Save Changes</Text>
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
    description: {
        fontSize: 14,
        fontFamily: 'NotoSans_400Regular',
        color: '#6b7280',
        marginBottom: 24,
        lineHeight: 20,
    },
    languageList: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        marginBottom: 24,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    selectedLanguageItem: {
        backgroundColor: '#f0fdf4',
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#1f2937',
        marginBottom: 4,
    },
    languageNativeName: {
        fontSize: 14,
        fontFamily: 'NotoSans_400Regular',
        color: '#6b7280',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#d1d5db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        backgroundColor: '#008351ff',
        borderColor: '#008351ff',
    },
    saveButton: {
        backgroundColor: '#008351ff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#008351',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'NotoSans_600SemiBold',
    },
    comingSoonBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    comingSoonText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#008351ff',
        lineHeight: 20,
    },
    disabledLanguageItem: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#9ca3af',
    },
    disabledRadioButton: {
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    disabledButton: {
        backgroundColor: '#d1d5db',
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledButtonText: {
        color: '#9ca3af',
    },
});
