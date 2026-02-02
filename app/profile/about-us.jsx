import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function AboutUsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </Pressable>
                <Text style={styles.title}>About Us</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Intro */}
                <View style={styles.section}>
                    <Image source={require('../../assets/MillatTimesLogo.avif')} style={styles.logo} />
                    <Text style={styles.description}>
                        Millat Times is a multilingual digital media platform committed to fair, fearless, and responsible journalism. Headquartered in Delhi, it publishes news in English, Urdu, Hindi, and Bangla, and operates YouTube channels in the same languages under Millat News Network Private Limited.
                    </Text>
                    <Text style={styles.description}>
                        With over 50 million monthly views, Millat Times has a strong readership in India and abroad, especially in the Gulf countries, the UK, and the USA. Its Urdu platform is among the most-viewed in India.
                    </Text>
                </View>

                {/* What We Cover */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What We Cover</Text>
                    <Text style={styles.description}>Millat Times reports on:</Text>
                    <View style={styles.list}>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>National & global affairs</Text>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Minority, OBC, and social issues</Text>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Elections, interviews, ground reports</Text>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Mob lynching, human rights, and justice</Text>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Muslim world, Urdu language & literature</Text>
                        </View>
                    </View>
                    <Text style={[styles.description, { marginTop: 8 }]}>
                        The platform focuses on stories and perspectives often ignored by mainstream media.
                    </Text>
                </View>

                {/* Our Journey */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Journey</Text>
                    <Text style={styles.description}>
                        Founded in 2016, Millat Times expanded rapidly across languages, mobile apps, and digital video platforms. Its YouTube journalism, ground reporting, and special programs like Khabar Dar Khabar and Khaas Mulaqat have gained nationwide recognition.
                    </Text>
                </View>

                {/* Our Values */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Values</Text>
                    <Text style={styles.description}>Millat Times stands for:</Text>
                    <View style={styles.list}>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Truth without pressure</Text>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Journalism with integrity</Text>
                        </View>
                        <View style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text style={styles.description}>Giving voice to the unheard</Text>
                        </View>
                    </View>
                    <Text style={[styles.description, { marginTop: 8 }]}>
                        Despite legal and political challenges, Millat Times continues to highlight facts, question power, and serve society through impactful journalism.
                    </Text>
                </View>

                <View style={styles.footerSpacing} />
            </ScrollView>
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
    content: {
        padding: 24,
    },
    logo: {
        width: '100%',
        height: 60,
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 16,
    },
    logoText: {
        fontSize: 28,
        fontFamily: 'NotoSans_700Bold',
        color: '#008351ff',
        marginBottom: 16,
        textAlign: 'center',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'NotoSans_600SemiBold',
        color: '#111827',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        fontFamily: 'NotoSans_400Regular',
        color: '#4b5563',
        lineHeight: 24,
        marginBottom: 12,
    },
    list: {
        marginTop: 4,
        paddingLeft: 4,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#008351ff',
        marginTop: 9,
        marginRight: 10,
    },
    footerSpacing: {
        height: 40,
    }
});
